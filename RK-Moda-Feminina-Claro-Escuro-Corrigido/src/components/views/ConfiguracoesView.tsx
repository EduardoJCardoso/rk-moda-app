import { ThemeStyleSheet } from '../../theme/ThemeStyleSheet';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  Store,
  Bell,
  Sliders,
  Settings,
  ShieldCheck,
  Check,
  Package,
} from '../MaterialIcon.tsx';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../theme/ThemeContext';

export const ConfiguracoesView: React.FC = () => {
  const { user, updateUser } = useApp();
  const { mode, setMode } = useTheme();

  const [storeName, setStoreName] = useState(user.store_name);
  const [storeEmail, setStoreEmail] = useState('contato@rkmodafeminina.com.br');
  const [storePhone, setStorePhone] = useState('(11) 98765-4321');
  const [storeCnpj, setStoreCnpj] = useState('48.912.345/0001-89');

  const [minStockAlert, setMinStockAlert] = useState('5');
  const [soundNotifications, setSoundNotifications] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSaveStore = () => {
    updateUser({ store_name: storeName });
    setSaveStatus('Informações da loja atualizadas com sucesso!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSavePreferences = () => {
    setSaveStatus('Preferências do sistema salvas com sucesso!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Configurações</Text>
          <Text style={styles.pageSubtitle}>
            Dados cadastrais e preferências de operação da loja
          </Text>
        </View>
      </View>

      {saveStatus && (
        <View style={styles.statusBanner}>
          <Check color="#34D399" size={16} />
          <Text style={styles.statusBannerText}>{saveStatus}</Text>
        </View>
      )}

      {/* Card 1: Dados da Loja */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Store color="#FF7597" size={18} />
            <Text style={styles.cardTitle}>Dados da Loja RK Moda</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusPillText}>Ativa</Text>
          </View>
        </View>

        <View style={styles.fieldsContainer}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Nome Comercial</Text>
            <TextInput
              value={storeName}
              onChangeText={setStoreName}
              style={styles.input}
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>E-mail Institucional</Text>
            <TextInput
              value={storeEmail}
              onChangeText={setStoreEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>WhatsApp / Atendimento</Text>
            <TextInput
              value={storePhone}
              onChangeText={setStorePhone}
              style={styles.input}
              keyboardType="phone-pad"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>CNPJ Cadastrado</Text>
            <TextInput
              value={storeCnpj}
              onChangeText={setStoreCnpj}
              style={styles.input}
              placeholderTextColor="#64748B"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSaveStore}
          activeOpacity={0.85}
          style={styles.saveBtn}
        >
          <Text style={styles.saveBtnText}>Salvar Dados da Loja</Text>
        </TouchableOpacity>
      </View>

      {/* Card 2: Preferências do Sistema */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Settings color="#FF7597" size={18} />
            <Text style={styles.cardTitle}>Aparência</Text>
          </View>
        </View>
        <View style={styles.themeRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleTitle}>Modo de exibição</Text>
            <Text style={styles.toggleSubtitle}>{mode === 'dark' ? 'Modo escuro ativado' : 'Modo claro ativado'}</Text>
          </View>
          <View style={styles.themeButtons}>
            <TouchableOpacity onPress={() => setMode('light')} style={[styles.themeButton, mode === 'light' && styles.themeButtonActive]}>
              <Text style={[styles.themeButtonText, mode === 'light' && styles.themeButtonTextActive]}>Claro</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode('dark')} style={[styles.themeButton, mode === 'dark' && styles.themeButtonActive]}>
              <Text style={[styles.themeButtonText, mode === 'dark' && styles.themeButtonTextActive]}>Escuro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Sliders color="#FF7597" size={18} />
            <Text style={styles.cardTitle}>Preferências & Sincronização</Text>
          </View>
        </View>

        <View style={styles.fieldsContainer}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Alerta de Estoque Mínimo (peças)</Text>
            <TextInput
              value={minStockAlert}
              onChangeText={setMinStockAlert}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#64748B"
            />
          </View>

          <TouchableOpacity
            onPress={() => setSoundNotifications(!soundNotifications)}
            style={styles.toggleRow}
            activeOpacity={0.8}
          >
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Avisos Sonoros de Novos Pedidos</Text>
              <Text style={styles.toggleSubtitle}>Tocar alerta ao receber venda</Text>
            </View>
            <View style={[styles.toggleSwitch, soundNotifications && styles.toggleSwitchActive]}>
              <View style={[styles.toggleKnob, soundNotifications && styles.toggleKnobActive]} />
            </View>
          </TouchableOpacity>

          <View style={styles.syncStatusRow}>
            <ShieldCheck color="#34D399" size={18} />
            <View style={{ flex: 1 }}>
              <Text style={styles.syncStatusTitle}>Sistema Sincronizado</Text>
              <Text style={styles.syncStatusSubtitle}>
                Atualização em tempo real ativa em todos os dispositivos
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSavePreferences}
          activeOpacity={0.85}
          style={styles.saveBtn}
        >
          <Text style={styles.saveBtnText}>Salvar Preferências</Text>
        </TouchableOpacity>
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    padding: 12,
  },
  statusBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34D399',
  },
  card: {
    backgroundColor: '#14182E',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#20274A',
    paddingBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34D399',
  },
  fieldsContainer: {
    gap: 12,
  },
  field: {
    gap: 5,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  input: {
    backgroundColor: '#0F1326',
    borderWidth: 1,
    borderColor: '#242B4E',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#FFFFFF',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F1326',
    borderWidth: 1,
    borderColor: '#20274A',
    borderRadius: 12,
    padding: 12,
  },
  toggleTextCol: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  toggleSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#334155',
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#FF7597',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  syncStatusTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34D399',
  },
  syncStatusSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  themeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
  },
  themeButtons: { flexDirection: 'row', gap: 8 },
  themeButton: { borderWidth: 1, borderColor: '#20274A', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  themeButtonActive: { backgroundColor: '#FF7597', borderColor: '#FF7597' },
  themeButtonText: { fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  themeButtonTextActive: { color: '#FFFFFF' },
  saveBtn: {
    backgroundColor: '#FF7597',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
