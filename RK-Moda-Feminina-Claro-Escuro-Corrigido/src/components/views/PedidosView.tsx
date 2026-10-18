import { ThemeStyleSheet } from '../../theme/ThemeStyleSheet';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Search,
  Plus,
} from '../MaterialIcon.tsx';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../theme/ThemeContext';

export const PedidosView: React.FC = () => {
  useTheme();
  const { orders, updateOrderStatus, setActiveHub } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [localSearch, setLocalSearch] = useState('');

  const stats = {
    todos: orders.length + 6172,
    pagos: orders.filter((o) => o.status === 'Pago').length + 3,
    aguardando: orders.filter((o) => o.status === 'Aguardando').length,
    enviados: 3505,
    cancelados: 2648,
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'Todos' || order.status === filterStatus;
    const matchesSearch =
      localSearch === '' ||
      order.id.toLowerCase().includes(localSearch.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(localSearch.toLowerCase()) ||
      order.products_desc.toLowerCase().includes(localSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Pedidos</Text>
          <Text style={styles.pageSubtitle}>Gerencie os pedidos da loja em tempo real</Text>
        </View>

        <TouchableOpacity
          onPress={() => setActiveHub('cadastro')}
          style={styles.newOrderBtn}
          activeOpacity={0.85}
        >
          <Plus color="#FFFFFF" size={16} />
          <Text style={styles.newOrderBtnText}>Novo Pedido</Text>
        </TouchableOpacity>
      </View>

      {/* 5 Status Filter Cards */}
      <View style={styles.statusGrid}>
        <TouchableOpacity
          onPress={() => setFilterStatus('Todos')}
          style={[styles.statusCard, filterStatus === 'Todos' && styles.statusCardActive]}
          activeOpacity={0.8}
        >
          <View style={styles.statusCardHeader}>
            <Text style={styles.statusLabel}>Todos</Text>
            <ShoppingBag color="#94A3B8" size={14} />
          </View>
          <Text style={styles.statusCount}>{stats.todos}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilterStatus('Pago')}
          style={[styles.statusCard, filterStatus === 'Pago' && styles.statusCardActive]}
          activeOpacity={0.8}
        >
          <View style={styles.statusCardHeader}>
            <Text style={styles.statusLabel}>Pagos</Text>
            <CheckCircle2 color="#34D399" size={14} />
          </View>
          <Text style={styles.statusCount}>{stats.pagos}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilterStatus('Aguardando')}
          style={[styles.statusCard, filterStatus === 'Aguardando' && styles.statusCardActive]}
          activeOpacity={0.8}
        >
          <View style={styles.statusCardHeader}>
            <Text style={styles.statusLabel}>Aguardando</Text>
            <Clock color="#FBBF24" size={14} />
          </View>
          <Text style={styles.statusCount}>{stats.aguardando}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilterStatus('Enviado')}
          style={[styles.statusCard, filterStatus === 'Enviado' && styles.statusCardActive]}
          activeOpacity={0.8}
        >
          <View style={styles.statusCardHeader}>
            <Text style={styles.statusLabel}>Enviados</Text>
            <Truck color="#C084FC" size={14} />
          </View>
          <Text style={styles.statusCount}>{stats.enviados}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilterStatus('Cancelado')}
          style={[styles.statusCard, filterStatus === 'Cancelado' && styles.statusCardActive]}
          activeOpacity={0.8}
        >
          <View style={styles.statusCardHeader}>
            <Text style={styles.statusLabel}>Cancelados</Text>
            <XCircle color="#FB7185" size={14} />
          </View>
          <Text style={styles.statusCount}>{stats.cancelados}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Search color="#94A3B8" size={16} />
        <TextInput
          value={localSearch}
          onChangeText={setLocalSearch}
          placeholder="Buscar por cliente, pedido ou peça..."
          placeholderTextColor="#64748B"
          style={styles.searchInput}
        />
      </View>

      {/* Orders List */}
      <View style={styles.ordersList}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Nenhum pedido encontrado para o filtro.</Text>
          </View>
        ) : (
          filteredOrders.map((ord) => (
            <View key={ord.id} style={styles.orderCard}>
              <View style={styles.orderTopRow}>
                <View style={styles.orderIdBox}>
                  <Text style={styles.orderIdText}>{ord.id}</Text>
                  <Text style={styles.orderDate}>{ord.date}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    ord.status === 'Pago'
                      ? styles.statusPago
                      : ord.status === 'Aguardando'
                      ? styles.statusAguardando
                      : ord.status === 'Enviado'
                      ? styles.statusEnviado
                      : styles.statusCancelado,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      ord.status === 'Pago'
                        ? styles.statusPagoText
                        : ord.status === 'Aguardando'
                        ? styles.statusAguardandoText
                        : ord.status === 'Enviado'
                        ? styles.statusEnviadoText
                        : styles.statusCanceladoText,
                    ]}
                  >
                    {ord.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.customerName}>{ord.customer_name}</Text>
              <Text style={styles.productsDesc}>{ord.products_desc}</Text>

              <View style={styles.orderBottomRow}>
                <Text style={styles.paymentMethod}>
                  {ord.payment_method} · {ord.items_count} item(ns)
                </Text>
                <Text style={styles.totalValue}>
                  R$ {ord.total.toFixed(2).replace('.', ',')}
                </Text>
              </View>

              {/* Quick Status Action Controls */}
              <View style={styles.quickStatusRow}>
                <Text style={styles.changeStatusLabel}>Alterar status:</Text>
                <View style={styles.statusButtonsGroup}>
                  {ord.status !== 'Pago' && (
                    <TouchableOpacity
                      onPress={() => updateOrderStatus(ord.id, 'Pago')}
                      style={styles.actionBtnSmall}
                    >
                      <Text style={styles.actionBtnSmallText}>Pago</Text>
                    </TouchableOpacity>
                  )}
                  {ord.status !== 'Enviado' && (
                    <TouchableOpacity
                      onPress={() => updateOrderStatus(ord.id, 'Enviado')}
                      style={styles.actionBtnSmall}
                    >
                      <Text style={styles.actionBtnSmallText}>Enviado</Text>
                    </TouchableOpacity>
                  )}
                  {ord.status !== 'Aguardando' && (
                    <TouchableOpacity
                      onPress={() => updateOrderStatus(ord.id, 'Aguardando')}
                      style={styles.actionBtnSmall}
                    >
                      <Text style={styles.actionBtnSmallText}>Aguardando</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
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
  newOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF7597',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  newOrderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusCard: {
    flex: 1,
    minWidth: 90,
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 14,
    padding: 10,
  },
  statusCardActive: {
    borderColor: '#FF7597',
    backgroundColor: '#1A203F',
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  statusCount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#FFFFFF',
  },
  ordersList: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: '#14182E',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  orderCard: {
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  orderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderIdBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderIdText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF7597',
  },
  orderDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusPago: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusPagoText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
  },
  statusAguardando: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
  },
  statusAguardandoText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '700',
  },
  statusEnviado: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
  },
  statusEnviadoText: {
    color: '#C084FC',
    fontSize: 10,
    fontWeight: '700',
  },
  statusCancelado: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
  },
  statusCanceladoText: {
    color: '#FB7185',
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadgeText: {},
  customerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  productsDesc: {
    fontSize: 12,
    color: '#94A3B8',
  },
  orderBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#20274A',
  },
  paymentMethod: {
    fontSize: 11,
    color: '#64748B',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#34D399',
  },
  quickStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  changeStatusLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  statusButtonsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtnSmall: {
    backgroundColor: '#0F1326',
    borderWidth: 1,
    borderColor: '#242B4E',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  actionBtnSmallText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#CBD5E1',
  },
});
