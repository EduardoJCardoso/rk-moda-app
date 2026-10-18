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
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  BarChart2,
  Settings,
  ArrowLeft,
  User,
  PlusCircle,
} from './MaterialIcon.tsx';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { NavTab } from '../types';
import { DashboardView } from './views/DashboardView';
import { PedidosView } from './views/PedidosView';
import { ProdutosView } from './views/ProdutosView';
import { ClientesView } from './views/ClientesView';
import { PrevisoesView } from './views/PrevisoesView';
import { RelatoriosView } from './views/RelatoriosView';
import { ConfiguracoesView } from './views/ConfiguracoesView';

export const PainelControle: React.FC = () => {
  const { isDark } = useTheme();
  const {
    activeTab,
    setActiveTab,
    setActiveHub,
    setIsProfileOpen,
    user,
  } = useApp();

  const tabs: Array<{ id: NavTab; label: string; icon: React.FC<{ color?: string; size?: number }> }> = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'previsoes', label: 'Previsões', icon: TrendingUp },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart2 },
    { id: 'configuracoes', label: 'Ajustes', icon: Settings },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'pedidos':
        return <PedidosView />;
      case 'produtos':
        return <ProdutosView />;
      case 'clientes':
        return <ClientesView />;
      case 'previsoes':
        return <PrevisoesView />;
      case 'relatorios':
        return <RelatoriosView />;
      case 'configuracoes':
        return <ConfiguracoesView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => setActiveHub('hub')}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ArrowLeft color={isDark ? '#FFFFFF' : '#0F172A'} size={18} />
          </TouchableOpacity>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.titleWhite}>RK </Text>
              <Text style={styles.titlePink}>Moda</Text>
            </View>
            <Text style={styles.subtitle}>Painel de Controle</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setActiveHub('cadastro')}
            style={styles.cadLinkBtn}
            activeOpacity={0.8}
          >
            <PlusCircle color="#FF7597" size={15} />
            <Text style={styles.cadLinkText}>Cadastro</Text>
          </TouchableOpacity>

          {/* PERFIL button in top corner as requested */}
          <TouchableOpacity
            onPress={() => setIsProfileOpen(true)}
            style={styles.profileBtn}
            activeOpacity={0.8}
          >
            <View style={styles.avatarMini}>
              <Text style={styles.avatarMiniText}>{user.avatar_initials}</Text>
            </View>
            <User color="#FF7597" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Navigation Tab Bar */}
      <View style={styles.navBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsRow}>
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setActiveTab(t.id)}
                  style={[styles.tabItem, isActive && styles.tabItemActive]}
                  activeOpacity={0.8}
                >
                  <Icon
                    color={isActive ? '#FFFFFF' : '#94A3B8'}
                    size={16}
                  />
                  <Text
                    style={[styles.tabItemText, isActive && styles.tabItemTextActive]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderActiveView()}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(36, 43, 78, 0.6)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWhite: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  titlePink: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF7597',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cadLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#161B33',
    borderWidth: 1,
    borderColor: '#242B4E',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  cadLinkText: {
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
  avatarMini: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF7597',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  navBar: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(36, 43, 78, 0.4)',
    backgroundColor: '#0F1225',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
  },
  tabItemActive: {
    backgroundColor: '#FF7597',
    borderColor: '#FF7597',
  },
  tabItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabItemTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
