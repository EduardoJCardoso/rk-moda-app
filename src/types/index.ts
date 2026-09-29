export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Conjunto' | 'Vestido' | 'Calça' | 'Blusa' | 'Outros' | string;
  type: string; // e.g. 'atributo_opcao'
  color: string;
  size: 'P' | 'M' | 'G' | 'GG' | 'U' | string;
  price: number;
  promo_price?: number | null;
  stock: number;
  image_url?: string;
  created_at?: string;
}

export interface Order {
  id: string; // e.g. "#6177"
  date: string; // e.g. "11/04/2026"
  timestamp: string; // ISO string for sorting
  customer_name: string;
  customer_email: string;
  products_desc: string;
  items_count: number;
  total: number;
  payment_method: 'Mercado Pago' | 'Pix' | 'Mercado Pago Checkout PRO' | 'Cartão de Crédito';
  status: 'Pago' | 'Aguardando' | 'Enviado' | 'Cancelado';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city: string;
  state: string;
  registered_date: string;
  total_orders?: number;
  total_spent?: number;
}

export interface MonthlyForecast {
  month: string; // e.g. "Mai/26"
  projected_sales: number;
  percent_of_total: number;
  vs_average: string; // e.g. "+98.1%"
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_initials: string;
  phone: string;
  store_name: string;
  created_at?: string;
}

export type NavTab = 
  | 'dashboard' 
  | 'pedidos' 
  | 'produtos' 
  | 'clientes' 
  | 'previsoes' 
  | 'relatorios' 
  | 'configuracoes';

export type DeviceMode = 'responsive' | 'ios' | 'android';
