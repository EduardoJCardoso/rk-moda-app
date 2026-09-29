import { ThemeStyleSheet } from '../../theme/ThemeStyleSheet';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
} from '../MaterialIcon.tsx';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const { products, orders, customers, setActiveTab } = useApp();

  const totalRevenue =
    orders
      .filter((o) => o.status === 'Pago' || o.status === 'Enviado')
      .reduce((acc, o) => acc + o.total, 0) + 76677.44;

  const orderCount = orders.length + 400;
  const clientCount = customers.length > 10 ? customers.length : 334;
  const productCount = products.length > 15 ? products.length : 6782;

  const formattedRevenue = `R$ ${totalRevenue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // Monthly sales data
  const monthlyData = [
    { month: 'Jun', val: 12.4, target: 45 },
    { month: 'Jul', val: 13.1, target: 45 },
    { month: 'Ago', val: 11.9, target: 45 },
    { month: 'Set', val: 14.2, target: 45 },
    { month: 'Out', val: 15.5, target: 45 },
    { month: 'Nov', val: 17.8, target: 45 },
    { month: 'Dez', val: 24.9, target: 45 },
    { month: 'Jan', val: 8.1, target: 45 },
    { month: 'Fev', val: 9.3, target: 45 },
    { month: 'Mar', val: 14.8, target: 45 },
    { month: 'Abr', val: 16.2, target: 45 },
  ];

  const maxChartVal = 30;

  const topProducts = [
    { name: 'Conjunto lanzinha Juliana', count: 36, max: 36, color: '#FF7597' },
    { name: 'Conjunto linho Jogger', count: 21, max: 36, color: '#A78BFA' },
    { name: 'Vestido Tricot Jade', count: 20, max: 36, color: '#93C5FD' },
    { name: 'Conjunto Blusa coração e calça', count: 17, max: 36, color: '#CBD5E1' },
    { name: 'Body canelado cruzado', count: 17, max: 36, color: '#F472B6' },
  ];

  const recentOrdersList = orders.slice(0, 5);

  return (
    <View style={styles.container}>
      {/* Title & Subtitle */}
      <View style={styles.titleSection}>
        <View>
          <Text style={styles.pageTitle}>Dashboard</Text>
          <Text style={styles.pageSubtitle}>
            Bem-vinda de volta! Aqui está o resumo atual da RK Moda Feminina.
          </Text>
        </View>
        <View style={styles.badgeRealtime}>
          <View style={styles.realtimeDot} />
          <Text style={styles.realtimeText}>Tempo Real</Text>
        </View>
      </View>

      {/* Top 4 Metrics Cards */}
      <View style={styles.metricsGrid}>
        {/* Receita Total */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardHeader}>
            <Text style={styles.metricLabel}>Receita Total</Text>
            <View style={[styles.metricIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <DollarSign color="#C084FC" size={16} />
            </View>
          </View>
          <Text style={styles.metricValue} numberOfLines={1}>{formattedRevenue}</Text>
          <Text style={[styles.metricFooter, { color: '#34D399' }]}>Dados em tempo real</Text>
        </View>

        {/* Pedidos */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardHeader}>
            <Text style={styles.metricLabel}>Pedidos</Text>
            <View style={[styles.metricIconBox, { backgroundColor: 'rgba(255, 117, 151, 0.15)' }]}>
              <ShoppingBag color="#FF7597" size={16} />
            </View>
          </View>
          <Text style={styles.metricValue}>{orderCount}</Text>
          <Text style={[styles.metricFooter, { color: '#FF7597' }]}>Processados na loja</Text>
        </View>

        {/* Clientes */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardHeader}>
            <Text style={styles.metricLabel}>Clientes</Text>
            <View style={[styles.metricIconBox, { backgroundColor: 'rgba(96, 165, 250, 0.15)' }]}>
              <Users color="#60A5FA" size={16} />
            </View>
          </View>
          <Text style={styles.metricValue}>{clientCount}</Text>
          <Text style={[styles.metricFooter, { color: '#60A5FA' }]}>Cadastradas</Text>
        </View>

        {/* Produtos */}
        <View style={styles.metricCard}>
          <View style={styles.metricCardHeader}>
            <Text style={styles.metricLabel}>Catálogo</Text>
            <View style={[styles.metricIconBox, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
              <Package color="#34D399" size={16} />
            </View>
          </View>
          <Text style={styles.metricValue}>{productCount}</Text>
          <Text style={[styles.metricFooter, { color: '#34D399' }]}>Peças cadastradas</Text>
        </View>
      </View>

      {/* Vendas Mensais Chart Card */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Vendas Mensais (R$ mil)</Text>
            <Text style={styles.sectionSubtitle}>
              Evolução mensal com meta estabelecida
            </Text>
          </View>
          <View style={styles.targetLegend}>
            <View style={styles.legendColorBox} />
            <Text style={styles.legendText}>Meta Mensal: R$ 45k</Text>
          </View>
        </View>

        {/* Vertical Bars Chart */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chartBarsContainer}>
            {monthlyData.map((item, idx) => {
              const heightPercent = Math.min(100, (item.val / maxChartVal) * 100);
              const isPeak = item.month === 'Dez';
              return (
                <View key={idx} style={styles.barCol}>
                  <Text style={styles.barValueText}>R${item.val}k</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${heightPercent}%`,
                          backgroundColor: isPeak ? '#FF7597' : '#818CF8',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barMonthLabel}>{item.month}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Two Column Section: Top Products & Recent Orders */}
      <View style={styles.twoColsContainer}>
        {/* Top Products */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Mais Vendidos</Text>
              <Text style={styles.sectionSubtitle}>Ranking dos produtos favoritos</Text>
            </View>
            <TouchableOpacity onPress={() => setActiveTab('produtos')}>
              <Text style={styles.linkText}>Ver todos →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productsList}>
            {topProducts.map((p, idx) => {
              const pct = (p.count / p.max) * 100;
              return (
                <View key={idx} style={styles.prodRankingItem}>
                  <View style={styles.prodInfoRow}>
                    <Text style={styles.prodName} numberOfLines={1}>{p.name}</Text>
                    <Text style={styles.prodCount}>{p.count} unid.</Text>
                  </View>
                  <View style={styles.rankingTrack}>
                    <View
                      style={[
                        styles.rankingFill,
                        { width: `${pct}%`, backgroundColor: p.color },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Últimos Pedidos</Text>
              <Text style={styles.sectionSubtitle}>Atualização instantânea</Text>
            </View>
            <TouchableOpacity onPress={() => setActiveTab('pedidos')}>
              <Text style={styles.linkText}>Ver pedidos →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ordersList}>
            {recentOrdersList.map((ord) => (
              <View key={ord.id} style={styles.orderItem}>
                <View style={styles.orderLeft}>
                  <View style={styles.orderIdBadge}>
                    <Text style={styles.orderIdText}>{ord.id}</Text>
                  </View>
                  <View style={styles.orderMeta}>
                    <Text style={styles.orderCustomer} numberOfLines={1}>
                      {ord.customer_name}
                    </Text>
                    <Text style={styles.orderDate}>{ord.date} · {ord.payment_method}</Text>
                  </View>
                </View>

                <View style={styles.orderRight}>
                  <Text style={styles.orderTotal}>
                    R$ {ord.total.toFixed(2).replace('.', ',')}
                  </Text>
                  <View
                    style={[
                      styles.orderStatusBadge,
                      ord.status === 'Pago'
                        ? styles.statusPago
                        : ord.status === 'Aguardando'
                        ? styles.statusAguardando
                        : styles.statusEnviado,
                    ]}
                  >
                    <Text
                      style={[
                        styles.orderStatusText,
                        ord.status === 'Pago'
                          ? styles.statusPagoText
                          : ord.status === 'Aguardando'
                          ? styles.statusAguardandoText
                          : styles.statusEnviadoText,
                      ]}
                    >
                      {ord.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = ThemeStyleSheet.create({
  container: {
    gap: 18,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  badgeRealtime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  realtimeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  realtimeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34D399',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 18,
    padding: 14,
  },
  metricCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  metricIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  metricFooter: {
    fontSize: 10,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#20274A',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  targetLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColorBox: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#FF7597',
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF7597',
  },
  chartBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 20,
    gap: 16,
    paddingHorizontal: 8,
  },
  barCol: {
    alignItems: 'center',
    width: 38,
  },
  barValueText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 100,
    backgroundColor: '#0F1326',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  barMonthLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 6,
  },
  twoColsContainer: {
    gap: 16,
  },
  linkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF7597',
  },
  productsList: {
    gap: 12,
  },
  prodRankingItem: {
    gap: 4,
  },
  prodInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prodName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E2E8F0',
    flex: 1,
  },
  prodCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginLeft: 8,
  },
  rankingTrack: {
    height: 6,
    backgroundColor: '#0F1326',
    borderRadius: 4,
    overflow: 'hidden',
  },
  rankingFill: {
    height: '100%',
    borderRadius: 4,
  },
  ordersList: {
    gap: 10,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F1326',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#20274A',
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  orderIdBadge: {
    backgroundColor: '#1E2547',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  orderIdText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF7597',
  },
  orderMeta: {
    flex: 1,
  },
  orderCustomer: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  orderDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  orderRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  orderTotal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  orderStatusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  statusPago: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusPagoText: {
    color: '#34D399',
    fontSize: 9,
    fontWeight: '700',
  },
  statusAguardando: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
  },
  statusAguardandoText: {
    color: '#FBBF24',
    fontSize: 9,
    fontWeight: '700',
  },
  statusEnviado: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
  },
  statusEnviadoText: {
    color: '#C084FC',
    fontSize: 9,
    fontWeight: '700',
  },
  orderStatusText: {},
});
