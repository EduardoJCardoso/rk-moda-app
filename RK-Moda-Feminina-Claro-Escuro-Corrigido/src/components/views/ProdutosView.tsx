import { ThemeStyleSheet } from '../../theme/ThemeStyleSheet';
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  Package,
  Plus,
  Search,
  Trash2,
  XCircle,
} from '../MaterialIcon.tsx';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { normalizeSearchText, searchSupabaseProducts } from '../../lib/supabase';
import { Product } from '../../types';

export const ProdutosView: React.FC = () => {
  useTheme();
  const { products, storeStats, updateProduct, deleteProduct, setActiveHub } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [remoteResults, setRemoteResults] = useState<Product[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [visibleCount, setVisibleCount] = useState(25);

  const activeCatalogCount = storeStats ? storeStats.total_produtos_ativos : products.length;
  const totalStockCount = activeCatalogCount * 25;
  const lowStockCount = products.filter((p) => (p.stock || 0) <= 20).length;
  const totalStockValue = products.reduce((acc, p) => acc + p.price * (p.stock || 0), 0);

  const categories = ['Todos', 'Vestido', 'Conjunto', 'Calça', 'Macaquinho', 'Blusa', 'Macacão', 'Saia', 'Body'];

  // Reset pagination when filter/search changes
  useEffect(() => {
    setVisibleCount(25);
  }, [search, selectedCategory]);

  // Query full Supabase catalog (5.876 active products) on search or category filter
  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed && selectedCategory === 'Todos') {
      setRemoteResults(null);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchSupabaseProducts(trimmed, selectedCategory, 100);
        if (!cancelled) {
          setRemoteResults(res);
        }
      } catch (err) {
        console.warn('Erro na busca de produtos no Supabase:', err);
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
  }, [search, selectedCategory]);

  // Combine instant local accent-insensitive filter with remote Supabase results
  const filteredProducts = useMemo(() => {
    const normQuery = normalizeSearchText(search);
    const normCat = normalizeSearchText(selectedCategory);

    const localMatches = products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'Todos' || normalizeSearchText(p.category) === normCat;
      if (!matchesCategory) return false;
      if (!normQuery) return true;
      const haystack = normalizeSearchText(
        `${p.name} ${p.sku} ${p.color} ${p.category} ${p.size} ${p.id}`
      );
      return haystack.includes(normQuery);
    });

    if (!remoteResults) {
      return localMatches;
    }

    const seen = new Set<string>();
    const merged: Product[] = [];
    for (const item of [...remoteResults, ...localMatches]) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    }
    return merged;
  }, [products, remoteResults, search, selectedCategory]);

  const displayedProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const handleStockDelta = (id: string, current: number, delta: number) => {
    const next = Math.max(0, current + delta);
    updateProduct(id, { stock: next });
    if (remoteResults) {
      setRemoteResults((prev) =>
        prev ? prev.map((p) => (p.id === id ? { ...p, stock: next } : p)) : prev
      );
    }
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    if (remoteResults) {
      setRemoteResults((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Produtos</Text>
          <Text style={styles.pageSubtitle}>Catálogo e controle de inventário da RK Moda</Text>
        </View>

        <TouchableOpacity
          onPress={() => setActiveHub('cadastro')}
          style={styles.newProdBtn}
          activeOpacity={0.85}
        >
          <Plus color="#FFFFFF" size={16} />
          <Text style={styles.newProdBtnText}>Novo Produto</Text>
        </TouchableOpacity>
      </View>

      {/* 4 Metrics Cards */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Peças</Text>
          <Text style={styles.metricValue}>{totalStockCount.toLocaleString('pt-BR')}</Text>
          <Text style={[styles.metricFooter, { color: '#34D399' }]}>Em estoque físico</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Modelos Ativos</Text>
          <Text style={styles.metricValue}>{activeCatalogCount.toLocaleString('pt-BR')}</Text>
          <Text style={[styles.metricFooter, { color: '#FF7597' }]}>No catálogo Supabase</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Estoque Baixo</Text>
          <Text style={styles.metricValue}>{lowStockCount}</Text>
          <Text style={[styles.metricFooter, { color: '#FBBF24' }]}>Menos de 20 un.</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Valor Amostra</Text>
          <Text style={styles.metricValue}>
            R$ {(totalStockValue / 1000).toFixed(1)}k
          </Text>
          <Text style={[styles.metricFooter, { color: '#A78BFA' }]}>Lote carregado</Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Search color="#94A3B8" size={16} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar em 5.876 produtos por nome, cor, tamanho ou SKU..."
          placeholderTextColor="#64748B"
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {isSearching && <ActivityIndicator size="small" color="#FF7597" />}
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
            <XCircle color="#94A3B8" size={16} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.categoriesRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Search Status Row */}
      {(search.trim() !== '' || selectedCategory !== 'Todos') && (
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {isSearching
              ? 'Buscando no catálogo completo do Supabase...'
              : `${filteredProducts.length} produto(s) encontrado(s)`}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSearch('');
              setSelectedCategory('Todos');
            }}
          >
            <Text style={styles.clearFilterLink}>Limpar filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Products List */}
      <View style={styles.productsList}>
        {displayedProducts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {isSearching
                ? 'Consultando produtos no Supabase...'
                : 'Nenhum produto encontrado para esta busca.'}
            </Text>
          </View>
        ) : (
          displayedProducts.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <View style={styles.productTopRow}>
                {item.image_url ? (
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderImg}>
                    <Package color="#94A3B8" size={24} />
                  </View>
                )}

                <View style={styles.productInfo}>
                  <View style={styles.skuRow}>
                    <Text style={styles.productSku}>{item.sku}</Text>
                    <Text style={styles.productCategory}>{item.category}</Text>
                  </View>

                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>

                  <View style={styles.attributeRow}>
                    <Text style={styles.attributeText}>Cor: {item.color}</Text>
                    <Text style={styles.attributeText}>· Tam: {item.size}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.deleteBtn}
                  activeOpacity={0.7}
                >
                  <Trash2 color="#94A3B8" size={16} />
                </TouchableOpacity>
              </View>

              <View style={styles.productBottomRow}>
                <View style={styles.priceContainer}>
                  <Text style={styles.productPrice}>
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </Text>
                  {item.promo_price && (
                    <Text style={styles.promoPrice}>
                      R$ {item.promo_price.toFixed(2).replace('.', ',')}
                    </Text>
                  )}
                </View>

                <View style={styles.stockStepper}>
                  <Text style={styles.stockLabel}>Estoque:</Text>
                  <TouchableOpacity
                    onPress={() => handleStockDelta(item.id, item.stock, -1)}
                    style={styles.stepperBtn}
                  >
                    <Text style={styles.stepperBtnText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.stockCountText}>{item.stock}</Text>

                  <TouchableOpacity
                    onPress={() => handleStockDelta(item.id, item.stock, 1)}
                    style={styles.stepperBtn}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        {filteredProducts.length > visibleCount && (
          <TouchableOpacity
            onPress={() => setVisibleCount((prev) => prev + 25)}
            style={styles.loadMoreBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.loadMoreText}>
              Ver mais produtos ({filteredProducts.length - visibleCount} restantes)
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
  newProdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF7597',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  newProdBtnText: {
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
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  categoryChipActive: {
    backgroundColor: '#FF7597',
    borderColor: '#FF7597',
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  categoryChipTextActive: {
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
  productsList: {
    gap: 12,
  },
  productCard: {
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  productTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#0F1326',
  },
  placeholderImg: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#0F1326',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  skuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  productSku: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF7597',
  },
  productCategory: {
    fontSize: 10,
    color: '#64748B',
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  attributeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    alignSelf: 'flex-start',
  },
  productBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#20274A',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  promoPrice: {
    fontSize: 12,
    color: '#34D399',
    fontWeight: '600',
  },
  stockStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#0F1326',
    borderWidth: 1,
    borderColor: '#242B4E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stockCountText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    minWidth: 20,
    textAlign: 'center',
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
