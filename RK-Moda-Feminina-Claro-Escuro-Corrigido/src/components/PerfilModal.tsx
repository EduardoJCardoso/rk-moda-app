import { ThemeStyleSheet } from '../theme/ThemeStyleSheet';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  X,
  User,
  Mail,
  Phone,
  Shield,
  Building,
  LogOut,
  Check,
  Sparkles,
} from './MaterialIcon.tsx';
import { useApp } from '../context/AppContext';

export const PerfilModal: React.FC = () => {
  const {
    isProfileOpen,
    setIsProfileOpen,
    user,
    updateUser,
    logout,
  } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [role, setRole] = useState(user.role);
  const [storeName, setStoreName] = useState(user.store_name);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    const initials = name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    updateUser({
      name,
      email,
      phone,
      role,
      store_name: storeName,
      avatar_initials: initials || 'AR',
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <Modal
      visible={isProfileOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsProfileOpen(false)}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalCard}>
            {/* Modal Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <Sparkles color="#FF7597" size={16} />
                <Text style={styles.headerTitle}>Perfil do Usuário</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsProfileOpen(false)}
                style={styles.closeBtn}
                activeOpacity={0.7}
              >
                <X color="#94A3B8" size={18} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Profile Card Summary */}
              <View style={styles.avatarRow}>
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarText}>{user.avatar_initials}</Text>
                </View>
                <View style={styles.avatarInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userRole}>{user.role}</Text>
                  <View style={styles.onlineBadge}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineText}>Online</Text>
                  </View>
                </View>
              </View>

              {/* Form Fields */}
              <View style={styles.formContainer}>
                <View style={styles.field}>
                  <View style={styles.fieldLabelRow}>
                    <User color="#FF7597" size={14} />
                    <Text style={styles.fieldLabel}>Nome Completo</Text>
                  </View>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    placeholderTextColor="#64748B"
                  />
                </View>

                <View style={styles.field}>
                  <View style={styles.fieldLabelRow}>
                    <Mail color="#FF7597" size={14} />
                    <Text style={styles.fieldLabel}>E-mail de Contato</Text>
                  </View>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#64748B"
                  />
                </View>

                <View style={styles.field}>
                  <View style={styles.fieldLabelRow}>
                    <Phone color="#FF7597" size={14} />
                    <Text style={styles.fieldLabel}>Telefone / WhatsApp</Text>
                  </View>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.input}
                    keyboardType="phone-pad"
                    placeholderTextColor="#64748B"
                  />
                </View>

                <View style={styles.field}>
                  <View style={styles.fieldLabelRow}>
                    <Shield color="#FF7597" size={14} />
                    <Text style={styles.fieldLabel}>Função / Cargo</Text>
                  </View>
                  <TextInput
                    value={role}
                    onChangeText={setRole}
                    style={styles.input}
                    placeholderTextColor="#64748B"
                  />
                </View>

                <View style={styles.field}>
                  <View style={styles.fieldLabelRow}>
                    <Building color="#FF7597" size={14} />
                    <Text style={styles.fieldLabel}>Nome da Loja</Text>
                  </View>
                  <TextInput
                    value={storeName}
                    onChangeText={setStoreName}
                    style={styles.input}
                    placeholderTextColor="#64748B"
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={handleSave}
                  activeOpacity={0.85}
                  style={styles.saveBtn}
                >
                  {savedSuccess ? (
                    <View style={styles.btnInner}>
                      <Check color="#FFFFFF" size={16} />
                      <Text style={styles.saveBtnText}>Salvo!</Text>
                    </View>
                  ) : (
                    <Text style={styles.saveBtnText}>Salvar Alterações</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={logout}
                  activeOpacity={0.85}
                  style={styles.logoutBtn}
                >
                  <LogOut color="#FB7185" size={16} />
                  <Text style={styles.logoutBtnText}>Sair</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = ThemeStyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  safeArea: {
    width: '100%',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#161B33',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#242B4E',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 10,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#242B4E',
    backgroundColor: 'rgba(255, 117, 151, 0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF7597',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F1326',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#242B4E',
    marginBottom: 16,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#FF7597',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  avatarInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userRole: {
    fontSize: 12,
    color: '#94A3B8',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34D399',
  },
  formContainer: {
    gap: 12,
  },
  field: {
    gap: 5,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: '#FF7597',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoutBtn: {
    flex: 1,
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FB7185',
  },
});
