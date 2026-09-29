import { ThemeStyleSheet } from '../theme/ThemeStyleSheet';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ShoppingBag, Sparkles } from './MaterialIcon.tsx';

interface InitialSplashScreenProps {
  onComplete: () => void;
}

export const InitialSplashScreen: React.FC<InitialSplashScreenProps> = ({ onComplete }) => {
  const [loadingStep, setLoadingStep] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const steps = [
    'Carregando RK Moda Feminina...',
    'Carregando catálogo e preferências...',
    'Sincronizando dados em tempo real...',
    'Pronto para iniciar!',
  ];

  useEffect(() => {
    // Fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        useNativeDriver: false,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2100,
        useNativeDriver: false,
      }),
    ]).start();

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 500);

    const timer = setTimeout(() => {
      onComplete();
    }, 2300);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['5%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Ambient background orbs */}
      <View style={styles.topOrb} />
      <View style={styles.bottomOrb} />

      <Animated.View
        style={[
          styles.contentCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Brand Icon Box */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBox}>
            <ShoppingBag color="#FF7597" size={44} strokeWidth={1.8} />
          </View>
          <View style={styles.sparkleBadge}>
            <Sparkles color="#F472B6" size={14} />
          </View>
        </View>

        {/* Brand Name */}
        <View style={styles.brandTitleRow}>
          <Text style={styles.brandTextMain}>RK </Text>
          <Text style={styles.brandTextAccent}>Moda</Text>
        </View>

        <Text style={styles.brandSubtitle}>
          Moda Feminina · Gestão & Loja Virtual
        </Text>

        {/* Progress Bar Container */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>

        {/* Step Label */}
        <Text style={styles.stepText}>{steps[loadingStep]}</Text>

        {/* Skip button */}
        <TouchableOpacity
          onPress={onComplete}
          activeOpacity={0.7}
          style={styles.skipButton}
        >
          <Text style={styles.skipButtonText}>Pular introdução →</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = ThemeStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E1B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  topOrb: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
  },
  bottomOrb: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
  },
  contentCard: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  iconBox: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: '#161B33',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 117, 151, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF7597',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  sparkleBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 117, 151, 0.25)',
    borderWidth: 1,
    borderColor: '#FF7597',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  brandTextMain: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandTextAccent: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF7597',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F472B6',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 32,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 7,
    backgroundColor: '#161B33',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#20274A',
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF7597',
    borderRadius: 6,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    height: 20,
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 28,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 37, 71, 0.6)',
  },
  skipButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
});
