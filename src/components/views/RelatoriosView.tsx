import { ThemeStyleSheet } from '../../theme/ThemeStyleSheet';
import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart,
} from '../MaterialIcon.tsx';
import { useApp } from '../../context/AppContext';

export const RelatoriosView: React.FC = () => {
  const { orders } = useApp();

  const totalRevenue =
    orders
      .filter((o) => o.status === 'Pago' || o.status === 'Enviado')
      .reduce((acc, o) => acc + o.total, 0) + 76677.44;

  const avgTicket = totalRevenue / (orders.length + 400);

  const paymentBreakdown = [
    { method: 'Mercado Pago', pct: 48, val: 'R$ 38.2k', color: '#FF7597' },
    { method: 'Pix Instantâneo', pct: 32, val: 'R$ 25.5k', color: '#34D399' },
    { method: 'Cartão de Crédito', pct: 15, val: 'R$ 11.9k', color: '#C084FC' },
    { method: 'Outros', pct: 5, val: 'R$ 4.0k', color: '#64748B' },
  ];

  const categoryBreakdown = [
    { name: 'Conjuntos de Alfaiataria & Linho', pct: 45, color: '#FF7597' },
    { name: 'Vestidos & Peças Únicas', pct: 25, color: '#A78BFA' },
    { name: 'Calças & Leggings', pct: 18, color: '#60A5FA' },
    { name: 'Blusas & Bodies', pct: 12, color: '#F472B6' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Relatórios</Text>
          <Text style={styles.pageSubtitle}>
            Consolidação financeira e canais de faturamento da RK Moda
          </Text>
        </View>
      </View>

      {/* 4 Summary Cards */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Receita Consolidada</Text>
          <Text style={styles.metricValue}>
            R$ {(totalRevenue / 1000).toFixed(1)}k
          </Text>
          <Text style={[styles.metricFooter, { color: '#34D399' }]}>No período total</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Ticket Médio</Text>
          <Text style={styles.metricValue}>
            R$ {avgTicket.toFixed(2).replace('.', ',')}
          </Text>
          <Text style={[styles.metricFooter, { color: '#FF7597' }]}>Por pedido aprovado</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total de Pedidos</Text>
          <Text style={styles.metricValue}>{orders.length + 400}</Text>
          <Text style={[styles.metricFooter, { color: '#C084FC' }]}>Finalizados</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Conversão Pix</Text>
          <Text style={styles.metricValue}>94.2%</Text>
          <Text style={[styles.metricFooter, { color: '#60A5FA' }]}>Aprovação rápida</Text>
        </View>
      </View>

      {/* Payment Methods Breakdown */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Faturamento por Meio de Pagamento</Text>
          <CreditCard color="#FF7597" size={16} />
        </View>

        <View style={styles.itemsList}>
          {paymentBreakdown.map((item, idx) => (
            <View key={idx} style={styles.breakdownItem}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.method}</Text>
                <Text style={styles.itemVal}>{item.val} ({item.pct}%)</Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${item.pct}%`, backgroundColor: item.color },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Category Performance Breakdown */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Participação por Categoria de Moda</Text>
          <PieChart color="#FF7597" size={16} />
        </View>

        <View style={styles.itemsList}>
          {categoryBreakdown.map((item, idx) => (
            <View key={idx} style={styles.breakdownItem}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemVal}>{item.pct}%</Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${item.pct}%`, backgroundColor: item.color },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = ThemeStyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 14,
    padding: 12,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  metricFooter: {
    fontSize: 10,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#20274A',
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  itemsList: {
    gap: 12,
  },
  breakdownItem: {
    gap: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  itemVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  track: {
    height: 6,
    backgroundColor: '#0F1326',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
