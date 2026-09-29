import { ThemeStyleSheet } from '../../theme/ThemeStyleSheet';
import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  TrendingUp,
  ArrowUpRight,
  BarChart2,
  CheckCircle,
  Sparkles,
} from '../MaterialIcon.tsx';

export const PrevisoesView: React.FC = () => {
  const monthsProjection = [
    { month: 'Mai/26', proj: 15.2, low: 14.0, high: 16.5, orders: 110, conf: '94%' },
    { month: 'Jun/26', proj: 16.4, low: 14.8, high: 18.0, orders: 122, conf: '91%' },
    { month: 'Jul/26', proj: 17.8, low: 15.5, high: 19.8, orders: 135, conf: '88%' },
    { month: 'Ago/26', proj: 18.5, low: 16.0, high: 21.0, orders: 140, conf: '85%' },
    { month: 'Set/26', proj: 19.9, low: 17.2, high: 22.5, orders: 154, conf: '82%' },
    { month: 'Out/26', proj: 24.2, low: 20.5, high: 28.0, orders: 190, conf: '79%' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Previsões</Text>
          <Text style={styles.pageSubtitle}>
            Análise preditiva e estimativas de vendas da RK Moda
          </Text>
        </View>

        <View style={styles.modelBadge}>
          <Sparkles color="#FF7597" size={14} />
          <Text style={styles.modelBadgeText}>Modelo Preditivo Ativo</Text>
        </View>
      </View>

      {/* 4 Metrics Cards */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Próximo Mês</Text>
            <TrendingUp color="#FF7597" size={14} />
          </View>
          <Text style={styles.metricValue}>R$ 16.400</Text>
          <Text style={[styles.metricFooter, { color: '#34D399' }]}>+8.5% sobre atual</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Crescimento</Text>
            <ArrowUpRight color="#34D399" size={14} />
          </View>
          <Text style={[styles.metricValue, { color: '#34D399' }]}>+8.5%</Text>
          <Text style={[styles.metricFooter, { color: '#94A3B8' }]}>Tendência de alta</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Melhor Mês</Text>
            <BarChart2 color="#C084FC" size={14} />
          </View>
          <Text style={styles.metricValue}>Out/26</Text>
          <Text style={[styles.metricFooter, { color: '#C084FC' }]}>R$ 24.200 estimados</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Confiança</Text>
            <CheckCircle color="#60A5FA" size={14} />
          </View>
          <Text style={styles.metricValue}>86.5%</Text>
          <Text style={[styles.metricFooter, { color: '#60A5FA' }]}>Alta precisão</Text>
        </View>
      </View>

      {/* Projections Table / Cards */}
      <View style={styles.tableCard}>
        <Text style={styles.tableTitle}>Projeção para os Próximos 6 Meses</Text>
        
        <View style={styles.projectionRowsList}>
          {monthsProjection.map((item, idx) => (
            <View key={idx} style={styles.projectionRow}>
              <View style={styles.monthBadge}>
                <Text style={styles.monthBadgeText}>{item.month}</Text>
              </View>

              <View style={styles.projValues}>
                <Text style={styles.projMainVal}>R$ {item.proj.toFixed(1)}k</Text>
                <Text style={styles.projInterval}>
                  Faixa: R$ {item.low.toFixed(1)}k — R$ {item.high.toFixed(1)}k
                </Text>
              </View>

              <View style={styles.projOrders}>
                <Text style={styles.projOrdersCount}>{item.orders} ped.</Text>
                <Text style={styles.projConfText}>Confiança {item.conf}</Text>
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
  modelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 117, 151, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 117, 151, 0.25)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  modelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF7597',
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
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
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
  tableCard: {
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  tableTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#20274A',
    paddingBottom: 10,
  },
  projectionRowsList: {
    gap: 10,
  },
  projectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F1326',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 12,
    padding: 12,
  },
  monthBadge: {
    backgroundColor: '#1E2547',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  monthBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF7597',
  },
  projValues: {
    flex: 1,
    paddingHorizontal: 12,
  },
  projMainVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  projInterval: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  projOrders: {
    alignItems: 'flex-end',
  },
  projOrdersCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  projConfText: {
    fontSize: 10,
    color: '#34D399',
    marginTop: 2,
  },
});
