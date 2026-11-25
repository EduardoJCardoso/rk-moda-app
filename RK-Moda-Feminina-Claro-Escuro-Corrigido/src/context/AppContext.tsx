import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Customer,
  DeviceMode,
  MonthlyForecast,
  NavTab,
  Order,
  Product,
  StoreStats,
  UserProfile,
} from '../types';
import { INITIAL_USER, MONTHLY_FORECASTS } from '../data/mockData';
import {
  clearCredentials,
  deleteSupabaseProduct,
  fetchSupabaseData,
  getLocalCustomers,
  getLocalOrders,
  getLocalProducts,
  getSavedCredentials,
  insertSupabaseCustomer,
  insertSupabaseOrder,
  insertSupabaseProduct,
  saveCredentials,
  saveLocalCustomers,
  saveLocalOrders,
  saveLocalProducts,
  subscribeToLocalSync,
  testConnection,
  updateSupabaseOrderStatus,
  updateSupabaseProduct,
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

  // Store entities & real Supabase stats
  products: Product[];
  orders: Order[];
  customers: Customer[];
  monthlyForecasts: MonthlyForecast[];
  storeStats: StoreStats | null;

  // Mutations
  addProduct: (product: Omit<Product, 'id' | 'sku'> & { id?: string; sku?: string }) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'timestamp'> & { id?: string; customer_id?: string }) => Promise<void>;
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeHub, setActiveHub] = useState<'hub' | 'panel' | 'cadastro'>('hub');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  // Store collections populated from Supabase
  const [products, setProducts] = useState<Product[]>(() => getLocalProducts());
  const [orders, setOrders] = useState<Order[]>(() => getLocalOrders());
  const [customers, setCustomers] = useState<Customer[]>(() => getLocalCustomers());
  const [monthlyForecasts, setMonthlyForecasts] = useState<MonthlyForecast[]>(MONTHLY_FORECASTS);
  const [storeStats, setStoreStats] = useState<StoreStats | null>(null);

  // Filters & device
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('responsive');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('Todos');

  // Supabase status
  const [supabaseConfig, setSupabaseConfig] = useState(getSavedCredentials());
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Base Supabase sincronizada via Transform_rk', time: 'Agora', read: false },
    { id: '2', title: 'Novo pedido #6524 recebido na Loja Integrada', time: 'Hoje', read: false },
    { id: '3', title: 'Catálogo atualizado com 5.876 produtos ativos', time: 'Hoje', read: false },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 1. Initial loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // 2. Fetch and synchronize data with Supabase
  const refreshData = async () => {
    if (supabaseConfig.isConfigured) {
      try {
        const data = await fetchSupabaseData();
        if (data.products.length > 0) {
          setProducts(data.products);
          saveLocalProducts(data.products);
        }
        if (data.orders.length > 0) {
          setOrders(data.orders);
          saveLocalOrders(data.orders);
        }
        if (data.customers.length > 0) {
          setCustomers(data.customers);
          saveLocalCustomers(data.customers);
        }
        if (data.forecasts.length > 0) {
          setMonthlyForecasts(data.forecasts);
        }
        if (data.stats) {
          setStoreStats(data.stats);
        }
        setSupabaseConnected(true);

        if (data.orders.length > 0 && data.stats) {
          const latestOrder = data.orders[0];
          setNotifications([
            {
              id: 'sync-1',
              title: `Último pedido ${latestOrder.id} (${latestOrder.customer_name}) - R$ ${latestOrder.total.toFixed(2)}`,
              time: latestOrder.date,
              read: false,
            },
            {
              id: 'sync-2',
              title: `Supabase conectado: ${data.stats.total_pedidos.toLocaleString('pt-BR')} pedidos e ${data.stats.total_clientes.toLocaleString('pt-BR')} clientes`,
              time: 'Tempo real',
              read: false,
            },
            {
              id: 'sync-3',
              title: `Catálogo ativo: ${data.stats.total_produtos_ativos.toLocaleString('pt-BR')} peças sincronizadas`,
              time: 'Tempo real',
              read: false,
            },
          ]);
        }
      } catch (err) {
        console.warn('Erro ao buscar dados do Supabase, mantendo cache local:', err);
        setSupabaseConnected(false);
      }
    } else {
      setProducts(getLocalProducts());
      setOrders(getLocalOrders());
      setCustomers(getLocalCustomers());
    }
  };

  // 3. Initial load and periodic sync
  useEffect(() => {
    refreshData();
    const unsubscribeLocal = subscribeToLocalSync((event) => {
      if (event.type === 'PRODUCTS_UPDATED') setProducts(event.data);
      if (event.type === 'ORDERS_UPDATED') setOrders(event.data);
      if (event.type === 'CUSTOMERS_UPDATED') setCustomers(event.data);
    });
    return () => {
      unsubscribeLocal();
    };
  }, [supabaseConfig.url, supabaseConfig.anonKey, supabaseConfig.isConfigured]);

  // Mutations connected to real Supabase tables
  const addProduct = async (prodData: Omit<Product, 'id' | 'sku'> & { id?: string; sku?: string }) => {
    const newId = prodData.id || `40009${Math.floor(1000 + Math.random() * 9000)}`;
    const newProduct: Product = {
      ...prodData,
      id: newId,
      sku: prodData.sku || `#${newId}`,
      created_at: new Date().toISOString(),
    };

    const nextList = [newProduct, ...products];
    setProducts(nextList);
    saveLocalProducts(nextList);

    if (supabaseConfig.isConfigured) {
      try {
        await insertSupabaseProduct(newProduct);
        await refreshData();
      } catch (err) {
        console.warn('Erro ao inserir produto no Supabase:', err);
      }
    }

    setNotifications((prev) => [
      { id: Date.now().toString(), title: `Novo produto cadastrado: ${newProduct.name}`, time: 'Agora', read: false },
      ...prev,
    ]);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const nextList = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setProducts(nextList);
    saveLocalProducts(nextList);

    if (supabaseConfig.isConfigured) {
      try {
        await updateSupabaseProduct(id, updates);
      } catch (err) {
        console.warn('Erro ao atualizar produto no Supabase:', err);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    const nextList = products.filter((p) => p.id !== id);
    setProducts(nextList);
    saveLocalProducts(nextList);

    if (supabaseConfig.isConfigured) {
      try {
        await deleteSupabaseProduct(id);
        await refreshData();
      } catch (err) {
        console.warn('Erro ao remover produto no Supabase:', err);
      }
    }
  };

  const addOrder = async (
    orderData: Omit<Order, 'id' | 'date' | 'timestamp'> & { id?: string; customer_id?: string }
  ) => {
    const maxId = orders.reduce((max, o) => {
      const n = Number(String(o.id).replace(/\D/g, ''));
      return n > max ? n : max;
    }, 6524);
    const orderNum = `#${maxId + 1}`;
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

    if (supabaseConfig.isConfigured) {
      try {
        const matchedCustomer =
          customers.find((c) => c.id === orderData.customer_id) ||
          customers.find((c) => c.name === orderData.customer_name) ||
          customers[0];
        const matchedProduct = products[0];
        await insertSupabaseOrder(newOrder, matchedCustomer?.id, matchedProduct?.id);
        await refreshData();
      } catch (err) {
        console.warn('Erro ao inserir pedido no Supabase:', err);
      }
    }

    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        title: `Novo pedido ${newOrder.id} de R$ ${newOrder.total.toFixed(2)} registrado`,
        time: 'Agora',
        read: false,
      },
      ...prev,
    ]);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const nextList = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(nextList);
    saveLocalOrders(nextList);

    if (supabaseConfig.isConfigured) {
      try {
        await updateSupabaseOrderStatus(orderId, status);
        await refreshData();
      } catch (err) {
        console.warn('Erro ao atualizar status do pedido no Supabase:', err);
      }
    }
  };

  const addCustomer = async (custData: Omit<Customer, 'id' | 'registered_date'> & { id?: string }) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const newId = custData.id || String(Math.floor(98000000 + Math.random() * 1000000));
    const newCust: Customer = {
      ...custData,
      id: newId,
      registered_date: formattedDate,
      total_orders: custData.total_orders || 0,
      total_spent: custData.total_spent || 0,
    };

    const nextList = [newCust, ...customers];
    setCustomers(nextList);
    saveLocalCustomers(nextList);

    if (supabaseConfig.isConfigured) {
      try {
        await insertSupabaseCustomer(newCust);
        await refreshData();
      } catch (err) {
        console.warn('Erro ao inserir cliente no Supabase:', err);
      }
    }

    setNotifications((prev) => [
      { id: Date.now().toString(), title: `Nova cliente cadastrada: ${newCust.name}`, time: 'Agora', read: false },
      ...prev,
    ]);
  };

  const updateSupabaseCredentials = async (url: string, anonKey: string) => {
    saveCredentials(url, anonKey);
    const check = await testConnection(url, anonKey);
    setSupabaseConfig({ url, anonKey, isConfigured: Boolean(url && anonKey) });
    if (check.success) {
      setSupabaseConnected(true);
      await refreshData();
      return true;
    }
    return false;
  };

  const disconnectSupabase = () => {
    clearCredentials();
    setSupabaseConfig(getSavedCredentials());
    setSupabaseConnected(false);
  };

  const login = async (_email?: string, _password?: string) => {
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
    setUser((prev) => ({ ...prev, ...updated }));
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
        storeStats,
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
