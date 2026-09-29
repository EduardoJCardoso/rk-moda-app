import { ThemeStyleSheet } from '../../theme/ThemeStyleSheet';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from '../MaterialIcon.tsx';
import { useApp } from '../../context/AppContext';

export const ClientesView: React.FC = () => {
  const { customers, setActiveHub, selectedStateFilter, setSelectedStateFilter } = useApp();
  const [searchFilter, setSearchFilter] = useState('');

  const stats = {
    total: customers.length + 5032,
    estados: 25,
    topSP: 418,
    topMG: 77,
  };

  const states = ['Todos', 'SP', 'MG', 'RJ', 'RS', 'PR', 'SC', 'GO'];

  const filteredCustomers = customers.filter((cust) => {
    const matchesState = selectedStateFilter === 'Todos' || cust.state === selectedStateFilter;
    const matchesSearch =
      searchFilter === '' ||
      cust.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cust.city.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesState && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Clientes</Text>
          <Text style={styles.pageSubtitle}>Base de clientes cadastrados da RK Moda</Text>
        </View>

        <TouchableOpacity
          onPress={() => setActiveHub('cadastro')}
          style={styles.newClientBtn}
          activeOpacity={0.85}
        >
          <UserPlus color="#FFFFFF" size={16} />
          <Text style={styles.newClientBtnText}>Nova Cliente</Text>
        </TouchableOpacity>
      </View>

      {/* 4 Metrics Cards */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Clientes</Text>
          <Text style={styles.metricValue}>{stats.total.toLocaleString('pt-BR')}</Text>
          <Text style={[styles.metricFooter, { color: '#C084FC' }]}>Cadastradas</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Estados</Text>
          <Text style={styles.metricValue}>{stats.estados}</Text>
          <Text style={[styles.metricFooter, { color: '#60A5FA' }]}>Atendidos no Brasil</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Top São Paulo</Text>
          <Text style={styles.metricValue}>{stats.topSP}</Text>
          <Text style={[styles.metricFooter, { color: '#FF7597' }]}>Maior concentração</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Top Minas</Text>
          <Text style={styles.metricValue}>{stats.topMG}</Text>
          <Text style={[styles.metricFooter, { color: '#34D399' }]}>Segunda maior</Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Search color="#94A3B8" size={16} />
        <TextInput
          value={searchFilter}
          onChangeText={setSearchFilter}
          placeholder="Buscar por nome, e-mail ou cidade..."
          placeholderTextColor="#64748B"
          style={styles.searchInput}
        />
      </View>

      {/* States Filter Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.statesRow}>
          {states.map((st) => (
            <TouchableOpacity
              key={st}
              onPress={() => setSelectedStateFilter(st)}
              style={[
                styles.stateChip,
                selectedStateFilter === st && styles.stateChipActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.stateChipText,
                  selectedStateFilter === st && styles.stateChipTextActive,
                ]}
              >
                {st === 'Todos' ? 'Todos os Estados' : `UF: ${st}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Customers List */}
      <View style={styles.customersList}>
        {filteredCustomers.map((cust) => (
          <View key={cust.id} style={styles.customerCard}>
            <View style={styles.custHeaderRow}>
              <View style={styles.avatarMini}>
                <Text style={styles.avatarMiniText}>
                  {cust.name.substring(0, 2).toUpperCase()}
                </Text>
              </View>

              <View style={styles.custMainInfo}>
                <Text style={styles.custName}>{cust.name}</Text>
                <View style={styles.custLocRow}>
                  <MapPin color="#94A3B8" size={12} />
                  <Text style={styles.custLocText}>
                    {cust.city} - {cust.state}
                  </Text>
                </View>
              </View>

              <View style={styles.stateBadge}>
                <Text style={styles.stateBadgeText}>{cust.state}</Text>
              </View>
            </View>

            {/* Contact Details */}
            <View style={styles.contactDetailsRow}>
              <View style={styles.contactItem}>
                <Mail color="#64748B" size={12} />
                <Text style={styles.contactItemText}>{cust.email}</Text>
              </View>
              {cust.phone && (
                <View style={styles.contactItem}>
                  <Phone color="#64748B" size={12} />
                  <Text style={styles.contactItemText}>{cust.phone}</Text>
                </View>
              )}
            </View>

            {/* Orders & Total Spent Summary */}
            <View style={styles.custFooterRow}>
              <View style={styles.custStatMini}>
                <Text style={styles.custStatMiniLabel}>Pedidos:</Text>
                <Text style={styles.custStatMiniVal}>{cust.total_orders || 1}</Text>
              </View>

              <View style={styles.custStatMini}>
                <Text style={styles.custStatMiniLabel}>Total Comprado:</Text>
                <Text style={styles.custStatMiniTotal}>
                  R$ {(cust.total_spent || 189.9).toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </View>
          </View>
        ))}
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
  newClientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF7597',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  newClientBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
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
  statesRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  stateChip: {
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  stateChipActive: {
    backgroundColor: '#FF7597',
    borderColor: '#FF7597',
  },
  stateChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  stateChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  customersList: {
    gap: 12,
  },
  customerCard: {
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  custHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarMini: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1F2547',
    borderWidth: 1,
    borderColor: 'rgba(255, 117, 151, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF7597',
  },
  custMainInfo: {
    flex: 1,
    gap: 2,
  },
  custName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  custLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  custLocText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  stateBadge: {
    backgroundColor: '#0F1326',
    borderWidth: 1,
    borderColor: '#242B4E',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  stateBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF7597',
  },
  contactDetailsRow: {
    gap: 4,
    backgroundColor: '#0F1326',
    borderRadius: 10,
    padding: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactItemText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  custFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#20274A',
  },
  custStatMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  custStatMiniLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  custStatMiniVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  custStatMiniTotal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#34D399',
  },
});
