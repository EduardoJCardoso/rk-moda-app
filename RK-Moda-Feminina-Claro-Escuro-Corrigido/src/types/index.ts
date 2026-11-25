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
  low?: number;
  high?: number;
  orders?: number;
  confidence?: string;
}

export interface StoreStats {
  receita_aprovada: number;
  receita_bruta_total: number;
  total_pedidos: number;
  pedidos_pagos: number;
  pedidos_aguardando: number;
  pedidos_enviados: number;
  pedidos_cancelados: number;
  total_clientes: number;
  total_estados: number;
  clientes_sp: number;
  clientes_mg: number;
  total_produtos_ativos: number;
  total_produtos_catalogo: number;
  vendas_mensais: Array<{
    ano_mes: string;
    mes_label: string;
    receita_total: number;
    receita_aprovada: number;
    qtd_pedidos: number;
  }>;
  top_produtos: Array<{
    id_produto: number;
    nome_produto: string;
    total_vendido: number;
    receita_gerada: number;
  }>;
  meios_pagamento: Array<{
    forma_pagamento: string;
    qtd_pedidos: number;
    valor_total: number;
    percentual: number;
  }>;
  categorias_vendas: Array<{
    categoria: string;
    qtd_produtos: number;
    itens_vendidos: number;
    receita_categoria: number;
    percentual_catalogo: number;
  }>;
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
