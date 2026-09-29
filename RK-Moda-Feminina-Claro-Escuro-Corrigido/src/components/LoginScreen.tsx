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
  ActivityIndicator,
} from 'react-native';
import { ShoppingBag, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Check } from './MaterialIcon.tsx';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('admin@rkmoda.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [name, setName] = useState('');
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await login(email, password);
    setIsSubmitting(false);
  };

  const handleDemoLogin = async () => {
    setEmail('admin@rkmoda.com');
    setPassword('admin123');
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    await login('admin@rkmoda.com', 'admin123');
    setIsSubmitting(false);
  };

  const handleForgotPassword = () => {
    setInfoMessage('Link de redefinição enviado para o e-mail cadastrado!');
    setTimeout(() => setInfoMessage(null), 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background ambient accents */}
      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Brand Logo Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <ShoppingBag color="#FF7597" size={32} />
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.titleMain}>RK </Text>
              <Text style={styles.titleAccent}>Moda</Text>
            </View>
            <Text style={styles.subtitle}>
              Moda Feminina · Acesso ao Sistema
            </Text>
          </View>

          {infoMessage && (
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerText}>{infoMessage}</Text>
            </View>
          )}

          {/* Form Container */}
          <View style={styles.form}>
            {isSignUpMode && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Ex: Vanessa Michele"
                  placeholderTextColor="#64748B"
                  style={styles.input}
                />
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWithIcon}>
                <View style={styles.leadingIcon}>
                  <Mail color="#94A3B8" size={18} />
                </View>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="admin@rkmoda.com"
                  placeholderTextColor="#64748B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.inputWithIconField}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWithIcon}>
                <View style={styles.leadingIcon}>
                  <Lock color="#94A3B8" size={18} />
                </View>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Sua senha secreta"
                  placeholderTextColor="#64748B"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={styles.inputWithIconField}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.trailingIcon}
                >
                  {showPassword ? (
                    <EyeOff color="#94A3B8" size={18} />
                  ) : (
                    <Eye color="#94A3B8" size={18} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me and Forgot Password */}
            <View style={styles.auxRow}>
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.rememberMeRow}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && <Check color="#FFFFFF" size={12} strokeWidth={3} />}
                </View>
                <Text style={styles.rememberMeText}>Lembrar-me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.85}
              style={styles.submitBtn}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.submitBtnInner}>
                  <Text style={styles.submitBtnText}>
                    {isSignUpMode ? 'Criar Conta' : 'Entrar na Loja'}
                  </Text>
                  <ArrowRight color="#FFFFFF" size={18} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Fast 1-click Demo Login */}
          <View style={styles.dividerBox}>
            <TouchableOpacity
              onPress={handleDemoLogin}
              activeOpacity={0.8}
              style={styles.demoLoginBtn}
            >
              <ShieldCheck color="#FF7597" size={18} />
              <Text style={styles.demoLoginText}>
                Acesso Rápido como Administradora RK Moda
              </Text>
            </TouchableOpacity>
          </View>

          {/* Toggle Sign Up / Sign In */}
          <View style={styles.toggleModeBox}>
            <Text style={styles.toggleModeText}>
              {isSignUpMode ? 'Já tem uma conta? ' : 'Ainda não possui acesso? '}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUpMode(!isSignUpMode)}>
              <Text style={styles.toggleModeLink}>
                {isSignUpMode ? 'Fazer Login' : 'Cadastrar-se agora'}
              </Text>
            </TouchableOpacity>
          </View>
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
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  topGlow: {
    position: 'absolute',
    top: 60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 117, 151, 0.08)',
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#161B33',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#242B4E',
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#1F2547',
    borderWidth: 1,
    borderColor: 'rgba(255, 117, 151, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleMain: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  titleAccent: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FF7597',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  infoBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  infoBannerText: {
    fontSize: 12,
    color: '#34D399',
    textAlign: 'center',
    fontWeight: '500',
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  input: {
    backgroundColor: '#0F1326',
    borderWidth: 1,
    borderColor: '#242B4E',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#FFFFFF',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1326',
    borderWidth: 1,
    borderColor: '#242B4E',
    borderRadius: 12,
  },
  leadingIcon: {
    paddingLeft: 12,
    paddingRight: 8,
  },
  trailingIcon: {
    paddingHorizontal: 12,
  },
  inputWithIconField: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#FFFFFF',
  },
  auxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#334155',
    backgroundColor: '#0F1326',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#FF7597',
    borderColor: '#FF7597',
  },
  rememberMeText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF7597',
  },
  submitBtn: {
    marginTop: 8,
    backgroundColor: '#FF7597',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF7597',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dividerBox: {
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#242B4E',
  },
  demoLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1F2547',
    borderWidth: 1,
    borderColor: '#2B3563',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  demoLoginText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  toggleModeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  toggleModeText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  toggleModeLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF7597',
  },
});
