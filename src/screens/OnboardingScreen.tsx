import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [lifeStage, setLifeStage] = useState('');

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasOnboarded = await AsyncStorage.getItem('@has_onboarded');
      if (hasOnboarded === 'true') {
        navigation.replace('MainTabs');
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@has_onboarded', 'true');
      await AsyncStorage.setItem('@user_life_stage', lifeStage);
      navigation.replace('MainTabs');
    } catch (e) {
      console.error('Error saving onboarding state', e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {step === 0 && (
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Adulting Copilot</Text>
          <Text style={styles.subtitle}>
            Your guide to handling the life admin tasks nobody teaches you.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => setStep(1)}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 1 && (
        <View style={styles.content}>
          <Text style={styles.title}>What stage of life are you in?</Text>
          <Text style={styles.subtitle}>We'll personalize your starter checklist based on this.</Text>

          <View style={styles.optionsContainer}>
            {['Student', 'New Job', 'First Apartment', 'Other'].map((stage) => (
              <TouchableOpacity
                key={stage}
                style={[
                  styles.optionButton,
                  lifeStage === stage && styles.optionButtonActive,
                ]}
                onPress={() => setLifeStage(stage)}
              >
                <Text
                  style={[
                    styles.optionText,
                    lifeStage === stage && styles.optionTextActive,
                  ]}
                >
                  {stage}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, !lifeStage && styles.buttonDisabled]}
            onPress={finishOnboarding}
            disabled={!lifeStage}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // slate-50
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A', // slate-900
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569', // slate-600
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionButton: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  optionButtonActive: {
    borderColor: '#4F46E5', // indigo-600
    backgroundColor: '#EEF2FF', // indigo-50
  },
  optionText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
    textAlign: 'center',
  },
  optionTextActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8', // slate-400
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
