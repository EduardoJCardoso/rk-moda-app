import { ThemeStyleSheet } from '../../theme/ThemeStyleSheet';
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  UserPlus,
  Search,
  Mail,
  Phone,
  MapPin,
  XCircle,
} from '../MaterialIcon.tsx';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { normalizeSearchText, searchSupabaseCustomers } from '../../lib/supabase';
import { Customer } from '../../types';

export const ClientesView: React.FC = () => {
  useTheme();
  const { customers, storeStats, setActiveHub, selectedStateFilter, setSelectedStateFilter } = useApp();
  const [searchFilter, setSearchFilter] = useState('');
  const [remoteCustomers, setRemoteCustomers] = useState<Customer[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [visibleCount, setVisibleCount] = useState(25);

  const stats = storeStats
    ? {
        total: storeStats.total_clientes,
        estados: storeStats.total_estados,
        topSP: storeStats.clientes_sp,
        topMG: storeStats.clientes_mg,
      }
    : {
        total: customers.length,
        estados: 27,
        topSP: customers.filter((c) => c.state === 'SP').length,
        topMG: customers.filter((c) => c.state === 'MG').length,
      };

  const states = ['Todos', 'SP', 'MG', 'RJ', 'RS', 'PR', 'SC', 'GO', 'BA', 'DF', 'PE', 'ES'];

  // Reset pagination when filter/search changes
  useEffect(() => {
    setVisibleCount(25);
  }, [searchFilter, selectedStateFilter]);

  // Query full Supabase base (5.267 customers) on search or state filter
  useEffect(() => {
    const trimmed = searchFilter.trim();
    if (!trimmed && selectedStateFilter === 'Todos') {
      setRemoteCustomers(null);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchSupabaseCustomers(trimmed, selectedStateFilter, 100);
        if (!cancelled) {
          setRemoteCustomers(res);
        }
      } catch (err) {
        console.warn('Erro na busca de clientes no Supabase:', err);
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchFilter, selectedStateFilter]);

  const filteredCustomers = useMemo(() => {
    const normQuery = normalizeSearchText(searchFilter);

    const localMatches = customers.filter((cust) => {
      const matchesState =
        selectedStateFilter === 'Todos' || cust.state === selectedStateFilter;
      if (!matchesState) return false;
      if (!normQuery) return true;
      const haystack = normalizeSearchText(
        `${cust.name} ${cust.email} ${cust.city} ${cust.state} ${cust.id}`
      );
      return haystack.includes(normQuery);
    });

    if (!remoteCustomers) {
      return localMatches;
    }

    const seen = new Set<string>();
    const merged: Customer[] = [];
    for (const item of [...remoteCustomers, ...localMatches]) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    }
    return merged;
  }, [customers, remoteCustomers, searchFilter, selectedStateFilter]);

  const displayedCustomers = useMemo(
    () => filteredCustomers.slice(0, visibleCount),
    [filteredCustomers, visibleCount]
  );

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
          <Text style={styles.metricValue}>{stats.topSP.toLocaleString('pt-BR')}</Text>
          <Text style={[styles.metricFooter, { color: '#FF7597' }]}>Maior concentração</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Top Minas</Text>
          <Text style={styles.metricValue}>{stats.topMG.toLocaleString('pt-BR')}</Text>
          <Text style={[styles.metricFooter, { color: '#34D399' }]}>Segunda maior</Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Search color="#94A3B8" size={16} />
        <TextInput
          value={searchFilter}
          onChangeText={setSearchFilter}
          placeholder="Buscar em 5.267 clientes por nome, e-mail, cidade ou CPF..."
          placeholderTextColor="#64748B"
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {isSearching && <ActivityIndicator size="small" color="#FF7597" />}
        {searchFilter.length > 0 && (
          <TouchableOpacity onPress={() => setSearchFilter('')} activeOpacity={0.7}>
            <XCircle color="#94A3B8" size={16} />
          </TouchableOpacity>
        )}
      </View>

      {/* States Filter Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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

      {/* Search Status Row */}
      {(searchFilter.trim() !== '' || selectedStateFilter !== 'Todos') && (
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {isSearching
              ? 'Buscando na base completa do Supabase...'
              : `${filteredCustomers.length} cliente(s) encontrada(s)`}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSearchFilter('');
              setSelectedStateFilter('Todos');
            }}
          >
            <Text style={styles.clearFilterLink}>Limpar filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Customers List */}
      <View style={styles.customersList}>
        {displayedCustomers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {isSearching
                ? 'Consultando clientes no Supabase...'
                : 'Nenhuma cliente encontrada para esta busca.'}
            </Text>
          </View>
        ) : (
          displayedCustomers.map((cust) => (
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
          ))
        )}

        {filteredCustomers.length > visibleCount && (
          <TouchableOpacity
            onPress={() => setVisibleCount((prev) => prev + 25)}
            style={styles.loadMoreBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.loadMoreText}>
              Ver mais clientes ({filteredCustomers.length - visibleCount} restantes)
            </Text>
          </TouchableOpacity>
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
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  resultsText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  clearFilterLink: {
    fontSize: 11,
    color: '#FF7597',
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
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
  loadMoreBtn: {
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#FF7597',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  loadMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF7597',
  },
});
