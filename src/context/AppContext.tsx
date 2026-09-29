import React, { createContext, useContext, useEffect, useState } from 'react';
import { Customer, DeviceMode, MonthlyForecast, NavTab, Order, Product, UserProfile } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_USER, MONTHLY_FORECASTS } from '../data/mockData';
import {
  clearCredentials,
  getLocalCustomers,
  getLocalOrders,
  getLocalProducts,
  getSavedCredentials,
  getSupabaseClient,
  saveCredentials,
  saveLocalCustomers,
  saveLocalOrders,
  saveLocalProducts,
  subscribeToLocalSync,
} from '../lib/supabase';

interface AppContextType {
  // Navigation & Screen flow
  isInitialLoading: boolean;
  setIsInitialLoading: (val: boolean) => void;
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  activeHub: 'hub' | 'panel' | 'cadastro';
  setActiveHub: (hub: 'hub' | 'panel' | 'cadastro') => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  
  // User Profile
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => void;

  // Store entities
  products: Product[];
  orders: Order[];
  customers: Customer[];
  monthlyForecasts: MonthlyForecast[];

  // Mutations
  addProduct: (product: Omit<Product, 'id' | 'sku'> & { id?: string; sku?: string }) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'timestamp'> & { id?: string }) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'registered_date'> & { id?: string }) => Promise<void>;

  // Supabase & Realtime status
  supabaseConfig: { url: string; anonKey: string; isConfigured: boolean };
  supabaseConnected: boolean;
  updateSupabaseCredentials: (url: string, anonKey: string) => Promise<boolean>;
  disconnectSupabase: () => void;
  refreshData: () => Promise<void>;

  // Device & Filters
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStateFilter: string;
  setSelectedStateFilter: (state: string) => void;
  notifications: Array<{ id: string; title: string; time: string; read: boolean }>;
  unreadCount: number;
  markNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial loading screen state (user requested initial loading with app name & RK name)
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Auth state - login screen is the first one after initial loading
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Flow after login: 'hub' displays "Cadastro" and "Painel de Controle" buttons + "Perfil" in corner
  const [activeHub, setActiveHub] = useState<'hub' | 'panel' | 'cadastro'>('hub');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // User Profile
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  // Data collections
  const [products, setProducts] = useState<Product[]>(() => getLocalProducts());
  const [orders, setOrders] = useState<Order[]>(() => getLocalOrders());
  const [customers, setCustomers] = useState<Customer[]>(() => getLocalCustomers());
  const [monthlyForecasts] = useState<MonthlyForecast[]>(MONTHLY_FORECASTS);

  // Filters & device
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('responsive');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('Todos');

  // Supabase status
  const [supabaseConfig, setSupabaseConfig] = useState(getSavedCredentials());
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Novo pedido #6177 recebido via Mercado Pago', time: 'Há 5 minutos', read: false },
    { id: '2', title: 'Estoque baixo: Body canelado cruzado (15 unid)', time: 'Há 25 minutos', read: false },
    { id: '3', title: 'Meta mensal de Abril atingiu 65%', time: 'Há 1 hora', read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // 1. Initial loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // 2. Fetch and synchronize data with Supabase or Local Storage
  const refreshData = async () => {
    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        const [prodRes, ordRes, custRes] = await Promise.all([
          client.from('products').select('*').order('created_at', { ascending: false }),
          client.from('orders').select('*').order('timestamp', { ascending: false }),
          client.from('customers').select('*').order('registered_date', { ascending: false }),
        ]);

        if (prodRes.data && prodRes.data.length > 0) {
          setProducts(prodRes.data);
          saveLocalProducts(prodRes.data);
        }
        if (ordRes.data && ordRes.data.length > 0) {
          setOrders(ordRes.data);
          saveLocalOrders(ordRes.data);
        }
        if (custRes.data && custRes.data.length > 0) {
          setCustomers(custRes.data);
          saveLocalCustomers(custRes.data);
        }
        setSupabaseConnected(true);
      } catch (err) {
        console.warn('Could not pull from remote Supabase, using synced local state:', err);
        setSupabaseConnected(false);
      }
    } else {
      setProducts(getLocalProducts());
      setOrders(getLocalOrders());
      setCustomers(getLocalCustomers());
    }
  };

  // 3. Supabase Real-time Channel setup
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client || !supabaseConfig.isConfigured) {
      // Listen to cross-tab / local realtime broadcast
      const unsubscribeLocal = subscribeToLocalSync(event => {
        if (event.type === 'PRODUCTS_UPDATED') setProducts(event.data);
        if (event.type === 'ORDERS_UPDATED') setOrders(event.data);
        if (event.type === 'CUSTOMERS_UPDATED') setCustomers(event.data);
      });
      return () => unsubscribeLocal();
    }

    setSupabaseConnected(true);
    refreshData();

    // Supabase Postgres Realtime Subscription
    const channel = client
      .channel('rk-realtime-all')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts(prev => [payload.new as Product, ...prev.filter(p => p.id !== payload.new.id)]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts(prev => prev.map(p => (p.id === payload.new.id ? (payload.new as Product) : p)));
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new as Order, ...prev.filter(o => o.id !== payload.new.id)]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(o => (o.id === payload.new.id ? (payload.new as Order) : o)));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCustomers(prev => [payload.new as Customer, ...prev.filter(c => c.id !== payload.new.id)]);
          } else if (payload.eventType === 'UPDATE') {
            setCustomers(prev => prev.map(c => (c.id === payload.new.id ? (payload.new as Customer) : c)));
          } else if (payload.eventType === 'DELETE') {
            setCustomers(prev => prev.filter(c => c.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setSupabaseConnected(true);
        }
      });

    return () => {
      client.removeChannel(channel);
    };
  }, [supabaseConfig.url, supabaseConfig.anonKey, supabaseConfig.isConfigured]);

  // Mutations with Realtime & Fallback
  const addProduct = async (prodData: Omit<Product, 'id' | 'sku'> & { id?: string; sku?: string }) => {
    const newId = prodData.id || `40009${Math.floor(1000 + Math.random() * 9000)}`;
    const newProduct: Product = {
      ...prodData,
      id: newId,
      sku: prodData.sku || `#${newId}`,
      created_at: new Date().toISOString(),
    };

    // Update local state immediately
    const nextList = [newProduct, ...products];
    setProducts(nextList);
    saveLocalProducts(nextList);

    // Try remote Supabase
    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('products').insert([newProduct]);
      } catch (err) {
        console.warn('Saved locally, Supabase insert deferred:', err);
      }
    }

    // Add notification
    setNotifications(prev => [
      { id: Date.now().toString(), title: `Novo produto cadastrado: ${newProduct.name}`, time: 'Agora', read: false },
      ...prev,
    ]);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const nextList = products.map(p => (p.id === id ? { ...p, ...updates } : p));
    setProducts(nextList);
    saveLocalProducts(nextList);

    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('products').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase product update error:', err);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    const nextList = products.filter(p => p.id !== id);
    setProducts(nextList);
    saveLocalProducts(nextList);

    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase product delete error:', err);
      }
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'timestamp'> & { id?: string }) => {
    const orderNum = `#${6178 + Math.floor(Math.random() * 100)}`;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    
    const newOrder: Order = {
      ...orderData,
      id: orderData.id || orderNum,
      date: formattedDate,
      timestamp: now.toISOString(),
    };

    const nextList = [newOrder, ...orders];
    setOrders(nextList);
    saveLocalOrders(nextList);

    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('orders').insert([newOrder]);
      } catch (err) {
        console.warn('Order saved locally, Supabase write error:', err);
      }
    }

    setNotifications(prev => [
      { id: Date.now().toString(), title: `Novo pedido ${newOrder.id} de R$ ${newOrder.total.toFixed(2)} registrado`, time: 'Agora', read: false },
      ...prev,
    ]);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const nextList = orders.map(o => (o.id === orderId ? { ...o, status } : o));
    setOrders(nextList);
    saveLocalOrders(nextList);

    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('orders').update({ status }).eq('id', orderId);
      } catch (err) {
        console.warn('Supabase order status update error:', err);
      }
    }
  };

  const addCustomer = async (custData: Omit<Customer, 'id' | 'registered_date'> & { id?: string }) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const newCust: Customer = {
      ...custData,
      id: custData.id || `c-${Date.now()}`,
      registered_date: formattedDate,
      total_orders: custData.total_orders || 0,
      total_spent: custData.total_spent || 0,
    };

    const nextList = [newCust, ...customers];
    setCustomers(nextList);
    saveLocalCustomers(nextList);

    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('customers').insert([newCust]);
      } catch (err) {
        console.warn('Customer saved locally, Supabase write error:', err);
      }
    }

    setNotifications(prev => [
      { id: Date.now().toString(), title: `Nova cliente cadastrada: ${newCust.name}`, time: 'Agora', read: false },
      ...prev,
    ]);
  };

  const updateSupabaseCredentials = async (url: string, anonKey: string) => {
    saveCredentials(url, anonKey);
    setSupabaseConfig({ url, anonKey, isConfigured: Boolean(url && anonKey) });
    const client = getSupabaseClient();
    if (client) {
      setSupabaseConnected(true);
      await refreshData();
      return true;
    }
    return false;
  };

  const disconnectSupabase = () => {
    clearCredentials();
    setSupabaseConfig({ url: '', anonKey: '', isConfigured: false });
    setSupabaseConnected(false);
  };

  const login = async (_email?: string, _password?: string) => {
    // User requested login screen as first.
    setIsAuthenticated(true);
    setActiveHub('hub');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveHub('hub');
    setIsProfileOpen(false);
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  return (
    <AppContext.Provider
      value={{
        isInitialLoading,
        setIsInitialLoading,
        isAuthenticated,
        login,
        logout,
        activeHub,
        setActiveHub,
        activeTab,
        setActiveTab,
        isProfileOpen,
        setIsProfileOpen,
        user,
        updateUser,
        products,
        orders,
        customers,
        monthlyForecasts,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        addCustomer,
        supabaseConfig,
        supabaseConnected,
        updateSupabaseCredentials,
        disconnectSupabase,
        refreshData,
        deviceMode,
        setDeviceMode,
        searchQuery,
        setSearchQuery,
        selectedStateFilter,
        setSelectedStateFilter,
        notifications,
        unreadCount,
        markNotificationsAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
