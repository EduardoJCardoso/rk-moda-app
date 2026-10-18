import { ThemeStyleSheet } from '../../theme/ThemeStyleSheet';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Package,
  Plus,
  Search,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from '../MaterialIcon.tsx';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../theme/ThemeContext';

export const ProdutosView: React.FC = () => {
  useTheme();
  const { products, updateProduct, deleteProduct, setActiveHub } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const totalStockCount = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => (p.stock || 0) <= 20).length;
  const totalStockValue = products.reduce((acc, p) => acc + p.price * (p.stock || 0), 0);

  const categories = ['Todos', 'Conjunto', 'Vestido', 'Calça', 'Blusa'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.color.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStockDelta = (id: string, current: number, delta: number) => {
    const next = Math.max(0, current + delta);
    updateProduct(id, { stock: next });
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
          <Text style={styles.metricValue}>{totalStockCount}</Text>
          <Text style={[styles.metricFooter, { color: '#34D399' }]}>Em estoque físico</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Modelos Ativos</Text>
          <Text style={styles.metricValue}>{products.length}</Text>
          <Text style={[styles.metricFooter, { color: '#FF7597' }]}>No catálogo</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Estoque Baixo</Text>
          <Text style={styles.metricValue}>{lowStockCount}</Text>
          <Text style={[styles.metricFooter, { color: '#FBBF24' }]}>Menos de 20 un.</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Valor Estoque</Text>
          <Text style={styles.metricValue}>
            R$ {(totalStockValue / 1000).toFixed(1)}k
          </Text>
          <Text style={[styles.metricFooter, { color: '#A78BFA' }]}>Preço de custo/venda</Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Search color="#94A3B8" size={16} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar produto por nome, cor ou código..."
          placeholderTextColor="#64748B"
          style={styles.searchInput}
        />
      </View>

      {/* Category Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

      {/* Products List */}
      <View style={styles.productsList}>
        {filteredProducts.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <View style={styles.productTopRow}>
              {/* Product Thumbnail */}
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

              {/* Product Details */}
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

              {/* Delete button */}
              <TouchableOpacity
                onPress={() => deleteProduct(item.id)}
                style={styles.deleteBtn}
                activeOpacity={0.7}
              >
                <Trash2 color="#94A3B8" size={16} />
              </TouchableOpacity>
            </View>

            {/* Price & Stock Adjustment Row */}
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

              {/* Stock Stepper */}
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
});
