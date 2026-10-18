import { Customer, Order, Product } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_ORDERS, INITIAL_PRODUCTS } from '../data/mockData';

// Versão local/mockada para Expo Go.
// O backend Supabase pode ser reativado futuramente sem alterar as telas.
const STORAGE_KEYS = {
  URL: 'rk_supabase_url',
  ANON_KEY: 'rk_supabase_anon_key',
  PRODUCTS: 'rk_local_products',
  ORDERS: 'rk_local_orders',
  CUSTOMERS: 'rk_local_customers',
};

const memoryStore: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      return (globalThis as any).localStorage.getItem(key);
    }
  } catch {}
  return memoryStore[key] || null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      (globalThis as any).localStorage.setItem(key, value);
    }
  } catch {}
  memoryStore[key] = value;
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      (globalThis as any).localStorage.removeItem(key);
    }
  } catch {}
  delete memoryStore[key];
}

export function getSavedCredentials() {
  const savedUrl = safeGetItem(STORAGE_KEYS.URL) || '';
  const savedKey = safeGetItem(STORAGE_KEYS.ANON_KEY) || '';
  return {
    url: savedUrl.trim(),
    anonKey: savedKey.trim(),
    isConfigured: false,
  };
}

// Backend desativado nesta versão para manter o app independente.
export function getSupabaseClient(): any {
  return null;
}

export function saveCredentials(url: string, anonKey: string) {
  safeSetItem(STORAGE_KEYS.URL, url.trim());
  safeSetItem(STORAGE_KEYS.ANON_KEY, anonKey.trim());
  return null;
}

export function clearCredentials() {
  safeRemoveItem(STORAGE_KEYS.URL);
  safeRemoveItem(STORAGE_KEYS.ANON_KEY);
}

export async function testConnection(_url: string, _anonKey: string) {
  return {
    success: false,
    message: 'Backend desativado nesta versão local do aplicativo.',
  };
}

type Listener = (event: { type: string; data: any }) => void;
const listeners = new Set<Listener>();

export function getLocalProducts(): Product[] {
  try {
    const raw = safeGetItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      safeSetItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveLocalProducts(products: Product[]) {
  safeSetItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  listeners.forEach(fn => {
    try { fn({ type: 'PRODUCTS_UPDATED', data: products }); } catch {}
  });
}

export function getLocalOrders(): Order[] {
  try {
    const raw = safeGetItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      safeSetItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveLocalOrders(orders: Order[]) {
  safeSetItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  listeners.forEach(fn => {
    try { fn({ type: 'ORDERS_UPDATED', data: orders }); } catch {}
  });
}

export function getLocalCustomers(): Customer[] {
  try {
    const raw = safeGetItem(STORAGE_KEYS.CUSTOMERS);
    if (!raw) {
      safeSetItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CUSTOMERS;
  }
}

export function saveLocalCustomers(customers: Customer[]) {
  safeSetItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  listeners.forEach(fn => {
    try { fn({ type: 'CUSTOMERS_UPDATED', data: customers }); } catch {}
  });
}

export function subscribeToLocalSync(callback: Listener) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
