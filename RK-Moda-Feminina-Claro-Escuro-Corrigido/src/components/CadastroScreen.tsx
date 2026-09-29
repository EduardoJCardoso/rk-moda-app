import { ThemeStyleSheet } from '../theme/ThemeStyleSheet';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  PackagePlus,
  UserPlus,
  FileText,
  ArrowLeft,
  LayoutDashboard,
  User,
  CheckCircle2,
} from './MaterialIcon.tsx';
import { useApp } from '../context/AppContext';

export const CadastroScreen: React.FC = () => {
  const {
    setActiveHub,
    setActiveTab,
    setIsProfileOpen,
    user,
    addProduct,
    addCustomer,
    addOrder,
    products,
    customers,
  } = useApp();

  const [activeFormTab, setActiveFormTab] = useState<'produto' | 'cliente' | 'pedido'>('produto');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states - Produto
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('Conjunto');
  const [productType, setProductType] = useState('atributo_opcao');
  const [productColor, setProductColor] = useState('');
  const [productSize, setProductSize] = useState('M');
  const [productPrice, setProductPrice] = useState('');
  const [productPromoPrice, setProductPromoPrice] = useState('');
  const [productStock, setProductStock] = useState('25');
  const [productImageUrl, setProductImageUrl] = useState('');

  // Form states - Cliente
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerState, setCustomerState] = useState('SP');

  // Form states - Pedido
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedProductDesc, setSelectedProductDesc] = useState('');
  const [orderItemsCount, setOrderItemsCount] = useState('1');
  const [orderTotal, setOrderTotal] = useState('');
  const [orderPayment, setOrderPayment] = useState<'Mercado Pago' | 'Pix' | 'Mercado Pago Checkout PRO' | 'Cartão de Crédito'>('Mercado Pago');
  const [orderStatus, setOrderStatus] = useState<'Pago' | 'Aguardando' | 'Enviado' | 'Cancelado'>('Pago');

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleProductSubmit = async () => {
    if (!productName.trim() || !productPrice.trim()) return;

    await addProduct({
      name: productName,
      category: productCategory,
      type: productType,
      color: productColor || 'Preto',
      size: productSize,
      price: parseFloat(productPrice.replace(',', '.')) || 99.9,
      promo_price: productPromoPrice ? parseFloat(productPromoPrice.replace(',', '.')) : null,
      stock: parseInt(productStock, 10) || 10,
      image_url: productImageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
    });

    showNotification(`Produto "${productName}" cadastrado com sucesso!`);
    setProductName('');
    setProductColor('');
    setProductPrice('');
    setProductPromoPrice('');
  };

  const handleCustomerSubmit = async () => {
    if (!customerName.trim() || !customerEmail.trim()) return;

    await addCustomer({
      name: customerName,
      email: customerEmail,
      phone: customerPhone || '(11) 99999-9999',
      city: customerCity || 'São Paulo',
      state: customerState,
    });

    showNotification(`Cliente "${customerName}" cadastrada com sucesso!`);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCustomerCity('');
  };

  const handleOrderSubmit = async () => {
    const cust = customers.find((c) => c.id === selectedCustomerId) || customers[0];
    const totalVal = parseFloat(orderTotal.replace(',', '.')) || 149.9;

    await addOrder({
      customer_name: cust ? cust.name : 'Cliente RK Moda',
      customer_email: cust ? cust.email : 'cliente@rkmoda.com',
      products_desc: selectedProductDesc || 'Conjunto RK Moda Feminina',
      items_count: parseInt(orderItemsCount, 10) || 1,
      total: totalVal,
      payment_method: orderPayment,
      status: orderStatus,
    });

    showNotification(`Pedido registrado com sucesso!`);
    setSelectedProductDesc('');
    setOrderTotal('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => setActiveHub('hub')}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ArrowLeft color="#FFFFFF" size={18} />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Módulo de Cadastro</Text>
            <Text style={styles.headerSubtitle}>RK Moda Feminina · Tempo Real</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              setActiveTab('dashboard');
              setActiveHub('panel');
            }}
            style={styles.panelLinkBtn}
            activeOpacity={0.8}
          >
            <LayoutDashboard color="#FF7597" size={16} />
            <Text style={styles.panelLinkText}>Painel</Text>
          </TouchableOpacity>

          {/* PERFIL button in top corner */}
          <TouchableOpacity
            onPress={() => setIsProfileOpen(true)}
            style={styles.profileBtn}
            activeOpacity={0.8}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>{user.avatar_initials}</Text>
            </View>
            <User color="#FF7597" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Success Alert Banner */}
        {successMessage && (
          <View style={styles.successBanner}>
            <View style={styles.successLeft}>
              <CheckCircle2 color="#34D399" size={18} />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
            <Text style={styles.successStatus}>Sincronizado</Text>
          </View>
        )}

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            onPress={() => setActiveFormTab('produto')}
            style={[styles.tabBtn, activeFormTab === 'produto' && styles.tabBtnActive]}
            activeOpacity={0.8}
          >
            <PackagePlus
              color={activeFormTab === 'produto' ? '#FFFFFF' : '#94A3B8'}
              size={16}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeFormTab === 'produto' && styles.tabBtnTextActive,
              ]}
            >
              Produto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFormTab('cliente')}
            style={[styles.tabBtn, activeFormTab === 'cliente' && styles.tabBtnActive]}
            activeOpacity={0.8}
          >
            <UserPlus
              color={activeFormTab === 'cliente' ? '#FFFFFF' : '#94A3B8'}
              size={16}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeFormTab === 'cliente' && styles.tabBtnTextActive,
              ]}
            >
              Cliente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFormTab('pedido')}
            style={[styles.tabBtn, activeFormTab === 'pedido' && styles.tabBtnActive]}
            activeOpacity={0.8}
          >
            <FileText
              color={activeFormTab === 'pedido' ? '#FFFFFF' : '#94A3B8'}
              size={16}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeFormTab === 'pedido' && styles.tabBtnTextActive,
              ]}
            >
              Pedido
            </Text>
          </TouchableOpacity>
        </View>

        {/* 1. FORM PRODUTO */}
        {activeFormTab === 'produto' && (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View>
                <Text style={styles.formTitle}>Novo Produto no Catálogo</Text>
                <Text style={styles.formSubtitle}>
                  Adicione peças femininas para venda com cores e tamanhos
                </Text>
              </View>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeInfoText}>{products.length} ativos</Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nome da Peça / Produto *</Text>
              <TextInput
                value={productName}
                onChangeText={setProductName}
                placeholder="Ex: Conjunto Alfaiataria Elegance"
                placeholderTextColor="#64748B"
                style={styles.textInput}
              />
            </View>

            {/* Category Options */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Categoria</Text>
              <View style={styles.optionsRow}>
                {['Conjunto', 'Vestido', 'Calça', 'Blusa', 'Outros'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setProductCategory(cat)}
                    style={[
                      styles.optionChip,
                      productCategory === cat && styles.optionChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        productCategory === cat && styles.optionChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Cor / Estampa</Text>
              <TextInput
                value={productColor}
                onChangeText={setProductColor}
                placeholder="Ex: Preto, Rosa Quartz, Fúcsia"
                placeholderTextColor="#64748B"
                style={styles.textInput}
              />
            </View>

            {/* Size Selector */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Tamanho</Text>
              <View style={styles.sizeRow}>
                {['P', 'M', 'G', 'GG', 'U'].map((sz) => (
                  <TouchableOpacity
                    key={sz}
                    onPress={() => setProductSize(sz)}
                    style={[
                      styles.sizeChip,
                      productSize === sz && styles.sizeChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sizeChipText,
                        productSize === sz && styles.sizeChipTextActive,
                      ]}
                    >
                      {sz}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Preço (R$) *</Text>
                <TextInput
                  value={productPrice}
                  onChangeText={setProductPrice}
                  placeholder="139,90"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  style={styles.textInput}
                />
              </View>

              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Promo (R$)</Text>
                <TextInput
                  value={productPromoPrice}
                  onChangeText={setProductPromoPrice}
                  placeholder="119,90"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  style={styles.textInput}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Quantidade em Estoque</Text>
              <TextInput
                value={productStock}
                onChangeText={setProductStock}
                placeholder="25"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <TouchableOpacity
              onPress={handleProductSubmit}
              activeOpacity={0.85}
              style={styles.submitBtn}
            >
              <Text style={styles.submitBtnText}>Cadastrar Produto</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 2. FORM CLIENTE */}
        {activeFormTab === 'cliente' && (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View>
                <Text style={styles.formTitle}>Cadastrar Nova Cliente</Text>
                <Text style={styles.formSubtitle}>
                  Registre dados para contato e emissão de pedidos
                </Text>
              </View>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeInfoText}>{customers.length} cadastradas</Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nome Completo da Cliente *</Text>
              <TextInput
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Ex: Rafaela Silveira"
                placeholderTextColor="#64748B"
                style={styles.textInput}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>E-mail *</Text>
              <TextInput
                value={customerEmail}
                onChangeText={setCustomerEmail}
                placeholder="rafaela@exemplo.com"
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.textInput}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Telefone / WhatsApp</Text>
              <TextInput
                value={customerPhone}
                onChangeText={setCustomerPhone}
                placeholder="(11) 98765-4321"
                placeholderTextColor="#64748B"
                keyboardType="phone-pad"
                style={styles.textInput}
              />
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.field, { flex: 2 }]}>
                <Text style={styles.fieldLabel}>Cidade</Text>
                <TextInput
                  value={customerCity}
                  onChangeText={setCustomerCity}
                  placeholder="Ex: São Paulo"
                  placeholderTextColor="#64748B"
                  style={styles.textInput}
                />
              </View>

              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Estado (UF)</Text>
                <TextInput
                  value={customerState}
                  onChangeText={setCustomerState}
                  placeholder="SP"
                  placeholderTextColor="#64748B"
                  autoCapitalize="characters"
                  maxLength={2}
                  style={styles.textInput}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleCustomerSubmit}
              activeOpacity={0.85}
              style={styles.submitBtn}
            >
              <Text style={styles.submitBtnText}>Salvar Cliente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 3. FORM PEDIDO */}
        {activeFormTab === 'pedido' && (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View>
                <Text style={styles.formTitle}>Registrar Novo Pedido</Text>
                <Text style={styles.formSubtitle}>
                  Emissão rápida para sincronização e controle
                </Text>
              </View>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeInfoText}>Tempo Real</Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Cliente</Text>
              <View style={styles.optionsRow}>
                {customers.slice(0, 4).map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setSelectedCustomerId(c.id)}
                    style={[
                      styles.optionChip,
                      selectedCustomerId === c.id && styles.optionChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        selectedCustomerId === c.id && styles.optionChipTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {c.name.split(' ')[0]} ({c.state})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Descrição dos Produtos *</Text>
              <TextInput
                value={selectedProductDesc}
                onChangeText={setSelectedProductDesc}
                placeholder="Ex: Conjunto Alfaiataria + Vestido Tricot"
                placeholderTextColor="#64748B"
                style={styles.textInput}
              />
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Qtd. Itens</Text>
                <TextInput
                  value={orderItemsCount}
                  onChangeText={setOrderItemsCount}
                  placeholder="1"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  style={styles.textInput}
                />
              </View>

              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Total (R$) *</Text>
                <TextInput
                  value={orderTotal}
                  onChangeText={setOrderTotal}
                  placeholder="279,80"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  style={styles.textInput}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Forma de Pagamento</Text>
              <View style={styles.optionsRow}>
                {(['Mercado Pago', 'Pix', 'Cartão de Crédito'] as const).map((pay) => (
                  <TouchableOpacity
                    key={pay}
                    onPress={() => setOrderPayment(pay)}
                    style={[
                      styles.optionChip,
                      orderPayment === pay && styles.optionChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        orderPayment === pay && styles.optionChipTextActive,
                      ]}
                    >
                      {pay}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Status do Pedido</Text>
              <View style={styles.optionsRow}>
                {(['Pago', 'Aguardando', 'Enviado'] as const).map((st) => (
                  <TouchableOpacity
                    key={st}
                    onPress={() => setOrderStatus(st)}
                    style={[
                      styles.optionChip,
                      orderStatus === st && styles.optionChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        orderStatus === st && styles.optionChipTextActive,
                      ]}
                    >
                      {st}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleOrderSubmit}
              activeOpacity={0.85}
              style={styles.submitBtn}
            >
              <Text style={styles.submitBtnText}>Gravar Pedido</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = ThemeStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E1B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(36, 43, 78, 0.6)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#161B33',
    borderWidth: 1,
    borderColor: '#242B4E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: {},
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF7597',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  panelLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#161B33',
    borderWidth: 1,
    borderColor: '#242B4E',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  panelLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#161B33',
    borderWidth: 1,
    borderColor: '#242B4E',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  profileAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF7597',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  successLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  successText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34D399',
    flex: 1,
  },
  successStatus: {
    fontSize: 10,
    color: '#34D399',
    fontWeight: '700',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#161B33',
    borderWidth: 1,
    borderColor: '#242B4E',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: '#FF7597',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#161B33',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#242B4E',
    padding: 20,
    gap: 16,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#242B4E',
    paddingBottom: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  formSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  badgeInfo: {
    backgroundColor: 'rgba(255, 117, 151, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 117, 151, 0.25)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  badgeInfoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF7597',
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  textInput: {
    backgroundColor: '#0F1326',
    borderWidth: 1,
    borderColor: '#242B4E',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#FFFFFF',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: '#0F1326',
    borderWidth: 1,
    borderColor: '#242B4E',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionChipActive: {
    backgroundColor: '#FF7597',
    borderColor: '#FF7597',
  },
  optionChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  optionChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeChip: {
    flex: 1,
    backgroundColor: '#0F1326',
    borderWidth: 1,
    borderColor: '#242B4E',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeChipActive: {
    backgroundColor: '#FF7597',
    borderColor: '#FF7597',
  },
  sizeChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  sizeChipTextActive: {
    color: '#FFFFFF',
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 12,
  },
  submitBtn: {
    marginTop: 8,
    backgroundColor: '#FF7597',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
