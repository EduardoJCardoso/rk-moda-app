import { Customer, MonthlyForecast, Order, Product, StoreStats } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_ORDERS, INITIAL_PRODUCTS, MONTHLY_FORECASTS } from '../data/mockData';

// Credenciais padrão do projeto Supabase da RK Moda Feminina
export const DEFAULT_SUPABASE_URL = 'https://wgxyuijfaievgusandya.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_-1e3uBL5VKgkBPaCVthiJA_l6Rp-0dH';

const STORAGE_KEYS = {
  URL: 'rk_supabase_url',
  ANON_KEY: 'rk_supabase_anon_key',
  PRODUCTS: 'rk_local_products',
  ORDERS: 'rk_local_orders',
  CUSTOMERS: 'rk_local_customers',
  STATS: 'rk_local_stats',
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
  const savedUrl = (safeGetItem(STORAGE_KEYS.URL) || DEFAULT_SUPABASE_URL).trim();
  const savedKey = (safeGetItem(STORAGE_KEYS.ANON_KEY) || DEFAULT_SUPABASE_KEY).trim();
  return {
    url: savedUrl,
    anonKey: savedKey,
    isConfigured: Boolean(savedUrl && savedKey),
  };
}

export function saveCredentials(url: string, anonKey: string) {
  safeSetItem(STORAGE_KEYS.URL, url.trim());
  safeSetItem(STORAGE_KEYS.ANON_KEY, anonKey.trim());
  return getSavedCredentials();
}

export function clearCredentials() {
  safeRemoveItem(STORAGE_KEYS.URL);
  safeRemoveItem(STORAGE_KEYS.ANON_KEY);
}

function getHeaders(anonKey?: string, prefer?: string): Record<string, string> {
  const key = (anonKey || getSavedCredentials().anonKey).trim();
  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
  if (prefer) {
    headers['Prefer'] = prefer;
  }
  return headers;
}

async function supabaseRest<T = any>(
  path: string,
  options: { method?: string; body?: any; prefer?: string; url?: string; anonKey?: string } = {}
): Promise<T> {
  const creds = getSavedCredentials();
  const baseUrl = (options.url || creds.url).replace(/\/+$/, '');
  const key = options.anonKey || creds.anonKey;
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    method: options.method || 'GET',
    headers: getHeaders(key, options.prefer),
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Supabase HTTP ${response.status}: ${errText}`);
  }

  const text = await response.text();
  if (!text) return [] as unknown as T;
  return JSON.parse(text) as T;
}

export function getSupabaseClient(): { url: string; anonKey: string } | null {
  const creds = getSavedCredentials();
  if (!creds.isConfigured) return null;
  return { url: creds.url, anonKey: creds.anonKey };
}

export async function testConnection(url?: string, anonKey?: string) {
  try {
    const rows = await supabaseRest<any[]>('vw_resumo_loja?select=*', { url, anonKey });
    return {
      success: true,
      message: `Conectado ao Supabase! (${rows?.[0]?.total_pedidos || 0} pedidos sincronizados)`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Não foi possível conectar ao Supabase.',
    };
  }
}

function formatDateBR(isoOrDate?: string | null): string {
  if (!isoOrDate) return '11/04/2026';
  const d = new Date(isoOrDate.replace(' ', 'T'));
  if (isNaN(d.getTime())) return String(isoOrDate).slice(0, 10);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function mapSituacaoToStatus(situacao?: string | null): Order['status'] {
  const s = (situacao || '').toLowerCase();
  if (s.includes('enviado')) return 'Enviado';
  if (s.includes('aguardando')) return 'Aguardando';
  if (s.includes('cancelado') || s.includes('devolvido') || s.includes('chargeback')) return 'Cancelado';
  return 'Pago';
}

export function mapStatusToSituacao(status: Order['status']): string {
  switch (status) {
    case 'Pago':
      return 'Pedido Pago';
    case 'Aguardando':
      return 'Aguardando pagamento';
    case 'Enviado':
      return 'Pedido Enviado';
    case 'Cancelado':
      return 'Pedido Cancelado';
    default:
      return 'Pedido Pago';
  }
}

function mapPaymentMethod(raw?: string | null): Order['payment_method'] {
  const p = (raw || '').trim();
  if (p.toLowerCase().includes('pix')) return 'Pix';
  if (p.toLowerCase().includes('checkout pro')) return 'Mercado Pago Checkout PRO';
  if (p.toLowerCase().includes('cart')) return 'Cartão de Crédito';
  return 'Mercado Pago';
}

const CATEGORY_IMAGES: Record<string, string> = {
  Conjunto: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
  Vestido: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80',
  Calça: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&q=80',
  Blusa: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80',
  Body: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80',
  Macacão: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
  Saia: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80',
  Short: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80',
};

export function normalizeSearchText(str?: string | null): string {
  if (!str) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function mapProductRow(row: any): Product {
  const cat = row.categoria || 'Outros';
  return {
    id: String(row.id_produto),
    sku: `#${row.id_produto}`,
    name: row.nome_produto || 'Peça RK Moda',
    category: cat,
    type: row.tipo_produto || 'atributo_opcao',
    color: row.cor_estampa || 'Única',
    size: String(row.numero_tamanho || 'U').toUpperCase(),
    price: Number(row.preco_cheio || 0),
    promo_price: Number(row.preco_promocional) > 0 ? Number(row.preco_promocional) : null,
    stock: Number(row.estoque ?? 25),
    image_url: CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.Conjunto,
  };
}

export function mapOrderRow(row: any): Order {
  const cliObj = Array.isArray(row.clientes) ? row.clientes[0] : row.clientes;
  return {
    id: `#${row.id_pedido}`,
    date: formatDateBR(row.data_pedido),
    timestamp: row.data_pedido || new Date().toISOString(),
    customer_name: cliObj?.nome_cliente || `Cliente #${row.id_cliente}`,
    customer_email: cliObj?.email || 'cliente@rkmoda.com.br',
    products_desc: row.produtos_resumo || 'Produto RK Moda',
    items_count: Number(row.qtd_itens || 1),
    total: Number(row.valor_total_pedido || 0),
    payment_method: mapPaymentMethod(row.forma_pagamento),
    status: mapSituacaoToStatus(row.situacao_pedido),
  };
}

export function mapCustomerRow(row: any): Customer {
  const peds = Array.isArray(row.pedidos) ? row.pedidos : [];
  const totalSpent = peds.reduce((acc: number, p: any) => acc + Number(p.valor_total_pedido || 0), 0);
  return {
    id: String(row.id_cliente),
    name: row.nome_cliente || 'Cliente RK Moda',
    email: row.email || 'contato@rkmoda.com.br',
    city: row.cidade_cliente || 'São Paulo',
    state: row.estado_cliente || 'SP',
    registered_date: formatDateBR(row.data_criacao),
    total_orders: peds.length,
    total_spent: totalSpent,
  };
}

export async function searchSupabaseProducts(
  query: string,
  category = 'Todos',
  limit = 100
): Promise<Product[]> {
  const params: string[] = ['select=*', 'removido=eq.false', 'order=id_produto.desc', `limit=${limit}`];

  if (category && category !== 'Todos') {
    params.push(`categoria=ilike.${encodeURIComponent(category)}`);
  }

  const trimmed = query.trim();
  if (trimmed) {
    const clean = trimmed.replace(/[,()]/g, ' ').trim();
    const numericId = clean.replace(/\D/g, '');
    const enc = encodeURIComponent(`*${clean}*`);
    const orParts = [
      `nome_produto.ilike.${enc}`,
      `cor_estampa.ilike.${enc}`,
      `categoria.ilike.${enc}`,
      `numero_tamanho.ilike.${enc}`,
    ];
    if (numericId.length >= 3) {
      orParts.push(`id_produto.eq.${numericId}`);
    }
    params.push(`or=(${orParts.join(',')})`);
  }

  const rows = await supabaseRest<any[]>(`produtos?${params.join('&')}`);
  return (rows || []).map(mapProductRow);
}

export async function searchSupabaseCustomers(
  query: string,
  state = 'Todos',
  limit = 100
): Promise<Customer[]> {
  const params: string[] = [
    'select=id_cliente,nome_cliente,email,data_criacao,cidade_cliente,estado_cliente,pedidos(valor_total_pedido)',
    'order=id_cliente.desc',
    `limit=${limit}`,
  ];

  if (state && state !== 'Todos') {
    params.push(`estado_cliente=eq.${encodeURIComponent(state)}`);
  }

  const trimmed = query.trim();
  if (trimmed) {
    const clean = trimmed.replace(/[,()]/g, ' ').trim();
    const numericId = clean.replace(/\D/g, '');
    const enc = encodeURIComponent(`*${clean}*`);
    const orParts = [
      `nome_cliente.ilike.${enc}`,
      `email.ilike.${enc}`,
      `cidade_cliente.ilike.${enc}`,
      `estado_cliente.ilike.${enc}`,
      `cpf.ilike.${enc}`,
    ];
    if (numericId.length >= 3) {
      orParts.push(`id_cliente.eq.${numericId}`);
    }
    params.push(`or=(${orParts.join(',')})`);
  }

  const rows = await supabaseRest<any[]>(`clientes?${params.join('&')}`);
  return (rows || []).map(mapCustomerRow);
}

export async function searchSupabaseOrders(
  query: string,
  status = 'Todos',
  limit = 100
): Promise<Order[]> {
  const params: string[] = [
    'select=id_pedido,id_cliente,data_pedido,valor_total_pedido,situacao_pedido,forma_pagamento,qtd_itens,produtos_resumo,clientes(nome_cliente,email)',
    'order=id_pedido.desc',
    `limit=${limit}`,
  ];

  if (status && status !== 'Todos') {
    if (status === 'Pago') {
      params.push('situacao_pedido=in.(%22Pedido%20Pago%22,%22Pedido%20Entregue%22)');
    } else if (status === 'Aguardando') {
      params.push('situacao_pedido=eq.Aguardando%20pagamento');
    } else if (status === 'Enviado') {
      params.push('situacao_pedido=eq.Pedido%20Enviado');
    } else if (status === 'Cancelado') {
      params.push('situacao_pedido=ilike.*Cancelado*');
    }
  }

  const trimmed = query.trim();
  if (trimmed) {
    const clean = trimmed.replace(/[,()]/g, ' ').trim();
    const numericId = clean.replace(/\D/g, '');
    const enc = encodeURIComponent(`*${clean}*`);
    const orParts = [`produtos_resumo.ilike.${enc}`, `forma_pagamento.ilike.${enc}`];
    if (numericId.length >= 1) {
      orParts.push(`id_pedido.eq.${numericId}`);
    }
    params.push(`or=(${orParts.join(',')})`);
  }

  const rows = await supabaseRest<any[]>(`pedidos?${params.join('&')}`);
  return (rows || []).map(mapOrderRow);
}

export async function fetchSupabaseData(): Promise<{
  products: Product[];
  orders: Order[];
  customers: Customer[];
  forecasts: MonthlyForecast[];
  stats: StoreStats | null;
}> {
  const [
    rawProducts,
    rawOrders,
    rawCustomers,
    rawForecasts,
    rawResumo,
    rawMensais,
    rawTopProd,
    rawPagamentos,
    rawCategorias,
  ] = await Promise.all([
    supabaseRest<any[]>(
      'produtos?select=*&removido=eq.false&order=id_produto.desc&limit=120'
    ),
    supabaseRest<any[]>(
      'pedidos?select=id_pedido,id_cliente,data_pedido,valor_total_pedido,situacao_pedido,forma_pagamento,qtd_itens,produtos_resumo,clientes(nome_cliente,email)&order=id_pedido.desc&limit=120'
    ),
    supabaseRest<any[]>(
      'clientes?select=id_cliente,nome_cliente,email,data_criacao,cidade_cliente,estado_cliente,pedidos(valor_total_pedido)&order=id_cliente.desc&limit=120'
    ),
    supabaseRest<any[]>('previsoes?select=*&order=id_previsao.asc'),
    supabaseRest<any[]>('vw_resumo_loja?select=*'),
    supabaseRest<any[]>('vw_vendas_mensais?select=*'),
    supabaseRest<any[]>('vw_top_produtos?select=*'),
    supabaseRest<any[]>('vw_meios_pagamento?select=*'),
    supabaseRest<any[]>('vw_categorias_vendas?select=*'),
  ]);

  const products: Product[] = (rawProducts || []).map(mapProductRow);
  const orders: Order[] = (rawOrders || []).map(mapOrderRow);
  const customers: Customer[] = (rawCustomers || []).map(mapCustomerRow);

  const forecasts: MonthlyForecast[] =
    rawForecasts && rawForecasts.length > 0
      ? rawForecasts.map((row) => ({
          month: row.mes,
          projected_sales: Number(row.previsao_vendas || 0),
          percent_of_total: Number(row.percentual_total || 0),
          vs_average: row.vs_media || '+0.0%',
          low: Number(row.faixa_min || 0),
          high: Number(row.faixa_max || 0),
          orders: Number(row.pedidos_estimados || 0),
          confidence: row.confianca || '88%',
        }))
      : MONTHLY_FORECASTS;

  const resumo = rawResumo?.[0];
  const stats: StoreStats | null = resumo
    ? {
        receita_aprovada: Number(resumo.receita_aprovada || 0),
        receita_bruta_total: Number(resumo.receita_bruta_total || 0),
        total_pedidos: Number(resumo.total_pedidos || 0),
        pedidos_pagos: Number(resumo.pedidos_pagos || 0),
        pedidos_aguardando: Number(resumo.pedidos_aguardando || 0),
        pedidos_enviados: Number(resumo.pedidos_enviados || 0),
        pedidos_cancelados: Number(resumo.pedidos_cancelados || 0),
        total_clientes: Number(resumo.total_clientes || 0),
        total_estados: Number(resumo.total_estados || 0),
        clientes_sp: Number(resumo.clientes_sp || 0),
        clientes_mg: Number(resumo.clientes_mg || 0),
        total_produtos_ativos: Number(resumo.total_produtos_ativos || 0),
        total_produtos_catalogo: Number(resumo.total_produtos_catalogo || 0),
        vendas_mensais: (rawMensais || [])
          .map((m) => ({
            ano_mes: m.ano_mes,
            mes_label: m.mes_label,
            receita_total: Number(m.receita_total || 0),
            receita_aprovada: Number(m.receita_aprovada || 0),
            qtd_pedidos: Number(m.qtd_pedidos || 0),
          }))
          .reverse(),
        top_produtos: (rawTopProd || []).map((tp) => ({
          id_produto: Number(tp.id_produto),
          nome_produto: tp.nome_produto || 'Peça RK Moda',
          total_vendido: Number(tp.total_vendido || 0),
          receita_gerada: Number(tp.receita_gerada || 0),
        })),
        meios_pagamento: (rawPagamentos || []).map((mp) => ({
          forma_pagamento: mp.forma_pagamento || 'Mercado Pago',
          qtd_pedidos: Number(mp.qtd_pedidos || 0),
          valor_total: Number(mp.valor_total || 0),
          percentual: Number(mp.percentual || 0),
        })),
        categorias_vendas: (rawCategorias || []).map((cv) => ({
          categoria: cv.categoria || 'Outros',
          qtd_produtos: Number(cv.qtd_produtos || 0),
          itens_vendidos: Number(cv.itens_vendidos || 0),
          receita_categoria: Number(cv.receita_categoria || 0),
          percentual_catalogo: Number(cv.percentual_catalogo || 0),
        })),
      }
    : null;

  return { products, orders, customers, forecasts, stats };
}

export async function insertSupabaseProduct(product: Product): Promise<void> {
  const numericId = Number(String(product.id).replace(/\D/g, '')) || Date.now();
  await supabaseRest('produtos', {
    method: 'POST',
    prefer: 'return=minimal',
    body: {
      id_produto: numericId,
      nome_produto: product.name,
      removido: false,
      tipo_produto: product.type || 'atributo_opcao',
      cor_estampa: product.color || 'Única',
      numero_tamanho: product.size || 'U',
      preco_cheio: product.price,
      preco_promocional: product.promo_price || 0,
      categoria: product.category || 'Outros',
      estoque: product.stock ?? 25,
    },
  });
}

export async function updateSupabaseProduct(id: string, updates: Partial<Product>): Promise<void> {
  const numericId = Number(String(id).replace(/\D/g, ''));
  if (!numericId) return;
  const payload: Record<string, any> = {};
  if (updates.name !== undefined) payload.nome_produto = updates.name;
  if (updates.price !== undefined) payload.preco_cheio = updates.price;
  if (updates.promo_price !== undefined) payload.preco_promocional = updates.promo_price || 0;
  if (updates.stock !== undefined) payload.estoque = updates.stock;
  if (updates.category !== undefined) payload.categoria = updates.category;
  if (updates.color !== undefined) payload.cor_estampa = updates.color;
  if (updates.size !== undefined) payload.numero_tamanho = updates.size;

  await supabaseRest(`produtos?id_produto=eq.${numericId}`, {
    method: 'PATCH',
    prefer: 'return=minimal',
    body: payload,
  });
}

export async function deleteSupabaseProduct(id: string): Promise<void> {
  const numericId = Number(String(id).replace(/\D/g, ''));
  if (!numericId) return;
  await supabaseRest(`produtos?id_produto=eq.${numericId}`, {
    method: 'PATCH',
    prefer: 'return=minimal',
    body: { removido: true },
  });
}

export async function insertSupabaseCustomer(customer: Customer): Promise<number> {
  const numericId = Number(String(customer.id).replace(/\D/g, '')) || Math.floor(90000000 + Math.random() * 9000000);
  await supabaseRest('clientes', {
    method: 'POST',
    prefer: 'return=minimal',
    body: {
      id_cliente: numericId,
      nome_cliente: customer.name,
      email: customer.email,
      sexo: 'F',
      data_criacao: new Date().toISOString().replace('T', ' ').slice(0, 19),
      cidade_cliente: customer.city || 'São Paulo',
      estado_cliente: (customer.state || 'SP').toUpperCase().slice(0, 2),
    },
  });
  return numericId;
}

export async function insertSupabaseOrder(
  order: Order,
  customerId?: string,
  productId?: string
): Promise<void> {
  const numericOrderId = Number(String(order.id).replace(/\D/g, '')) || Math.floor(7000 + Math.random() * 9000);
  const numericCustId = Number(String(customerId || '').replace(/\D/g, '')) || null;
  const numericProdId = Number(String(productId || '').replace(/\D/g, '')) || null;
  const dataIso = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const situacao = mapStatusToSituacao(order.status);

  await supabaseRest('pedidos', {
    method: 'POST',
    prefer: 'return=minimal',
    body: {
      id_pedido: numericOrderId,
      id_cliente: numericCustId,
      data_pedido: dataIso,
      valor_envio_pedido: 0,
      valor_subtotal_pedido: order.total,
      valor_total_pedido: order.total,
      situacao_pedido: situacao,
      forma_pagamento: order.payment_method,
      qtd_itens: order.items_count || 1,
      produtos_resumo: order.products_desc,
    },
  });

  await supabaseRest('itens_pedido', {
    method: 'POST',
    prefer: 'return=minimal',
    body: {
      data_pedido: dataIso,
      id_pedido: numericOrderId,
      id_cliente: numericCustId,
      id_produto: numericProdId,
      nome_produto: order.products_desc,
      preco_produto: order.total / Math.max(1, order.items_count || 1),
      qtd_produto: order.items_count || 1,
      valor_envio_pedido: 0,
      valor_subtotal_pedido: order.total,
      valor_total_pedido: order.total,
      situacao_pedido: situacao,
      forma_pagamento: order.payment_method,
    },
  });
}

export async function updateSupabaseOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const numericOrderId = Number(String(orderId).replace(/\D/g, ''));
  if (!numericOrderId) return;
  const situacao = mapStatusToSituacao(status);

  await Promise.all([
    supabaseRest(`pedidos?id_pedido=eq.${numericOrderId}`, {
      method: 'PATCH',
      prefer: 'return=minimal',
      body: { situacao_pedido: situacao },
    }),
    supabaseRest(`itens_pedido?id_pedido=eq.${numericOrderId}`, {
      method: 'PATCH',
      prefer: 'return=minimal',
      body: { situacao_pedido: situacao },
    }),
  ]);
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
  listeners.forEach((fn) => {
    try {
      fn({ type: 'PRODUCTS_UPDATED', data: products });
    } catch {}
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
  listeners.forEach((fn) => {
    try {
      fn({ type: 'ORDERS_UPDATED', data: orders });
    } catch {}
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
  listeners.forEach((fn) => {
    try {
      fn({ type: 'CUSTOMERS_UPDATED', data: customers });
    } catch {}
  });
}

export function subscribeToLocalSync(callback: Listener) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
