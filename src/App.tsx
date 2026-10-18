import { ThemeStyleSheet } from './theme/ThemeStyleSheet';
import React from 'react';
import { View } from 'react-native';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { setThemeMode } from './theme/ThemeStyleSheet';
import { InitialSplashScreen } from './components/InitialSplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { PostLoginHub } from './components/PostLoginHub';
import { CadastroScreen } from './components/CadastroScreen';
import { PainelControle } from './components/PainelControle';
import { PerfilModal } from './components/PerfilModal';

const MainNavigator: React.FC = () => {
  const { mode } = useTheme();
  setThemeMode(mode);
  const { isInitialLoading, setIsInitialLoading, isAuthenticated, activeHub } = useApp();

  // 1. Initial Loading Screen ("tela de loading inicial com o nome dele e o nome da RK")
  if (isInitialLoading) {
    return <InitialSplashScreen onComplete={() => setIsInitialLoading(false)} />;
  }

  // 2. Login Screen ("A tela de login deve ser a primeira")
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // 3. Post-Login Flow ("Após o login, o aplicativo deve exibir os botões 'Cadastro' e 'Painel de Controle'...")
  return (
    <View key={mode} style={styles.appContainer}>
      {activeHub === 'hub' && <PostLoginHub />}
      {activeHub === 'cadastro' && <CadastroScreen />}
      {activeHub === 'panel' && <PainelControle />}

      {/* Global Perfil section/modal accessed from top corner button */}
      <PerfilModal />
    </View>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainNavigator />
      </AppProvider>
    </ThemeProvider>
  );
}

const styles = ThemeStyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#0B0E1B',
  },
});
