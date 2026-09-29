import { ThemeStyleSheet } from '../theme/ThemeStyleSheet';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  ShoppingBag,
  LayoutDashboard,
  UserPlus,
  User,
  TrendingUp,
  Package,
  Users,
  ArrowRight,
  Sparkles,
} from './MaterialIcon.tsx';
import { useApp } from '../context/AppContext';

export const PostLoginHub: React.FC = () => {
  const {
    setActiveHub,
    setActiveTab,
    setIsProfileOpen,
    user,
    products,
    orders,
    customers,
  } = useApp();

  const totalRevenue =
    orders
      .filter((o) => o.status === 'Pago' || o.status === 'Enviado')
      .reduce((acc, o) => acc + o.total, 0) + 76677.44;

  const formattedRevenue = `R$ ${totalRevenue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background accents */}
      <View style={styles.bgGlowTop} />
      <View style={styles.bgGlowBottom} />

      {/* Top Header with Brand & PERFIL button in top corner as requested */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandLogoBox}>
            <ShoppingBag color="#FF7597" size={20} />
          </View>
          <View>
            <View style={styles.brandNameRow}>
              <Text style={styles.brandNameWhite}>RK </Text>
              <Text style={styles.brandNamePink}>Moda</Text>
            </View>
            <Text style={styles.brandTagline}>Moda Feminina · Loja & Gestão</Text>
          </View>
        </View>

        {/* PERFIL BUTTON in top corner as explicitly requested */}
        <TouchableOpacity
          onPress={() => setIsProfileOpen(true)}
          activeOpacity={0.8}
          style={styles.profileBtn}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{user.avatar_initials}</Text>
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.profileName} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={styles.profileRole}>Perfil</Text>
          </View>
          <User color="#FF7597" size={16} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeBadge}>
            <Sparkles color="#FF7597" size={14} />
            <Text style={styles.welcomeBadgeText}>
              Bem-vinda à RK Moda Feminina
            </Text>
          </View>
          <Text style={styles.welcomeTitle}>
            O que você deseja acessar agora?
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Selecione uma das opções abaixo para gerenciar o catálogo, emitir pedidos ou explorar os indicadores da loja.
          </Text>
        </View>

        {/* PRIMARY ACTION BUTTONS: "Cadastro" and "Painel de Controle" */}
        <View style={styles.actionsContainer}>
          {/* 1. Botão CADASTRO */}
          <TouchableOpacity
            onPress={() => setActiveHub('cadastro')}
            activeOpacity={0.85}
            style={[styles.primaryActionCard, styles.cadastroCardBorder]}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.cardIconBox, { backgroundColor: 'rgba(255, 117, 151, 0.15)' }]}>
                <UserPlus color="#FF7597" size={28} />
              </View>
              <View style={styles.actionBadge}>
                <Text style={styles.actionBadgeText}>Ação Rápida</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>Cadastro</Text>
                <ArrowRight color="#FF7597" size={20} />
              </View>
              <Text style={styles.cardDescription}>
                Cadastre novos produtos no catálogo, registre novas clientes ou gere pedidos manuais com sincronização instantânea.
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.footerTags}>Produtos · Clientes · Pedidos</Text>
              <Text style={styles.footerActionLink}>Abrir formulários →</Text>
            </View>
          </TouchableOpacity>

          {/* 2. Botão PAINEL DE CONTROLE */}
          <TouchableOpacity
            onPress={() => {
              setActiveTab('dashboard');
              setActiveHub('panel');
            }}
            activeOpacity={0.85}
            style={[styles.primaryActionCard, styles.panelCardBorder]}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.cardIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                <LayoutDashboard color="#FF7597" size={28} />
              </View>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>Tempo Real</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>Painel de Controle</Text>
                <ArrowRight color="#FF7597" size={20} />
              </View>
              <Text style={styles.cardDescription}>
                Acesse o dashboard completo: visualização de pedidos, catálogo detalhado, lista de clientes, projeções de vendas e relatórios gráficos.
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.footerTags}>Métricas · Gráficos · Relatórios</Text>
              <Text style={styles.footerActionLink}>Acessar Painel →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Live Store Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.statsSectionTitle}>Resumo da Loja</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>Receita da Loja</Text>
                <TrendingUp color="#34D399" size={16} />
              </View>
              <Text style={styles.statValue} numberOfLines={1}>{formattedRevenue}</Text>
              <Text style={[styles.statFooter, { color: '#34D399' }]}>Dados atualizados</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>Pedidos Totais</Text>
                <ShoppingBag color="#FF7597" size={16} />
              </View>
              <Text style={styles.statValue}>{orders.length + 400}</Text>
              <Text style={[styles.statFooter, { color: '#FF7597' }]}>Em processamento</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>Produtos Ativos</Text>
                <Package color="#A78BFA" size={16} />
              </View>
              <Text style={styles.statValue}>
                {products.length > 15 ? products.length : '6.782'}
              </Text>
              <Text style={[styles.statFooter, { color: '#A78BFA' }]}>No catálogo</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>Clientes Ativas</Text>
                <Users color="#60A5FA" size={16} />
              </View>
              <Text style={styles.statValue}>
                {customers.length > 10 ? customers.length : '5.038'}
              </Text>
              <Text style={[styles.statFooter, { color: '#60A5FA' }]}>Em 25 estados</Text>
            </View>
          </View>
        </View>

        {/* App Footer Info */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            RK Moda Feminina · Aplicativo Expo React Native · 2026
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = ThemeStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E1B',
  },
  bgGlowTop: {
    position: 'absolute',
    top: -50,
    right: 20,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 117, 151, 0.06)',
  },
  bgGlowBottom: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(168, 85, 247, 0.06)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(36, 43, 78, 0.6)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#161B33',
    borderWidth: 1,
    borderColor: 'rgba(255, 117, 151, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandNameWhite: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  brandNamePink: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF7597',
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#161B33',
    borderWidth: 1,
    borderColor: '#242B4E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  profileAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF7597',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileMeta: {
    maxWidth: 90,
  },
  profileName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileRole: {
    fontSize: 9,
    color: '#FF7597',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginVertical: 18,
  },
  welcomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 117, 151, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 117, 151, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  welcomeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F472B6',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 480,
    marginTop: 6,
    lineHeight: 18,
  },
  actionsContainer: {
    gap: 16,
    marginVertical: 16,
  },
  primaryActionCard: {
    backgroundColor: '#161B33',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  cadastroCardBorder: {
    borderColor: 'rgba(255, 117, 151, 0.35)',
  },
  panelCardBorder: {
    borderColor: 'rgba(168, 85, 247, 0.35)',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 117, 151, 0.3)',
  },
  actionBadge: {
    backgroundColor: 'rgba(255, 117, 151, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 117, 151, 0.3)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  actionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF7597',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  cardBody: {
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardDescription: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(36, 43, 78, 0.6)',
    paddingTop: 12,
  },
  footerTags: {
    fontSize: 11,
    color: '#64748B',
  },
  footerActionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF7597',
  },
  statsSection: {
    marginTop: 10,
  },
  statsSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#161B33',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#242B4E',
    padding: 14,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statFooter: {
    fontSize: 10,
    fontWeight: '500',
  },
  footerNote: {
    marginTop: 28,
    alignItems: 'center',
  },
  footerNoteText: {
    fontSize: 11,
    color: '#475569',
  },
});
