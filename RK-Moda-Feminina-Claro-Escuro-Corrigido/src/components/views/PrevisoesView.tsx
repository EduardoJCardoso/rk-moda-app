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
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../theme/ThemeContext';

export const PrevisoesView: React.FC = () => {
  useTheme();
  const { monthlyForecasts } = useApp();

  const monthsProjection =
    monthlyForecasts && monthlyForecasts.length > 0
      ? monthlyForecasts.slice(0, 6).map((f) => ({
          month: f.month,
          proj: Number(((f.projected_sales || 0) / 1000).toFixed(1)),
          low: Number(((f.low || f.projected_sales * 0.9) / 1000).toFixed(1)),
          high: Number(((f.high || f.projected_sales * 1.1) / 1000).toFixed(1)),
          orders: f.orders || Math.round((f.projected_sales || 0) / 130),
          conf: f.confidence || '89%',
          vs_avg: f.vs_average || '+8.5%',
        }))
      : [
          { month: 'Nov/26', proj: 15.2, low: 14.0, high: 16.5, orders: 110, conf: '94%', vs_avg: '+8.5%' },
          { month: 'Dez/26', proj: 24.2, low: 20.5, high: 28.0, orders: 190, conf: '91%', vs_avg: '+72.8%' },
          { month: 'Jan/27', proj: 12.4, low: 10.8, high: 14.0, orders: 95, conf: '89%', vs_avg: '-11.4%' },
          { month: 'Fev/27', proj: 14.8, low: 13.2, high: 16.4, orders: 112, conf: '86%', vs_avg: '+5.7%' },
          { month: 'Mar/27', proj: 17.8, low: 15.5, high: 19.8, orders: 135, conf: '84%', vs_avg: '+27.1%' },
          { month: 'Abr/27', proj: 19.9, low: 17.2, high: 22.5, orders: 154, conf: '82%', vs_avg: '+42.1%' },
        ];

  const nextMonth = monthsProjection[0];
  const bestMonth = [...monthsProjection].sort((a, b) => b.proj - a.proj)[0];

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
            <Text style={styles.metricLabel}>Próximo Mês ({nextMonth.month})</Text>
            <TrendingUp color="#FF7597" size={14} />
          </View>
          <Text style={styles.metricValue}>
            R$ {(nextMonth.proj * 1000).toLocaleString('pt-BR')}
          </Text>
          <Text style={[styles.metricFooter, { color: '#34D399' }]}>{nextMonth.vs_avg} vs média</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Crescimento</Text>
            <ArrowUpRight color="#34D399" size={14} />
          </View>
          <Text style={[styles.metricValue, { color: '#34D399' }]}>{nextMonth.vs_avg}</Text>
          <Text style={[styles.metricFooter, { color: '#94A3B8' }]}>Tendência projetada</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Melhor Mês</Text>
            <BarChart2 color="#C084FC" size={14} />
          </View>
          <Text style={styles.metricValue}>{bestMonth.month}</Text>
          <Text style={[styles.metricFooter, { color: '#C084FC' }]}>
            R$ {(bestMonth.proj * 1000).toLocaleString('pt-BR')} estimados
          </Text>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Confiança</Text>
            <CheckCircle color="#60A5FA" size={14} />
          </View>
          <Text style={styles.metricValue}>{nextMonth.conf}</Text>
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
