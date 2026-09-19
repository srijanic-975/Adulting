import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Purchases from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRevenueCat } from '../context/RevenueCatContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Paywall'>;

export default function PaywallScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { checkEntitlements } = useRevenueCat();
  const [loading, setLoading] = useState(false);

  const handleSelfPay = async (isAnnual: boolean) => {
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        // Mock purchase for web demo
        await AsyncStorage.setItem('@mock_premium', 'true');
        await checkEntitlements();
        Alert.alert('Success', 'You are now a Premium member!');
        navigation.goBack();
        return;
      }

      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        const pkg = isAnnual ? offerings.current.annual : offerings.current.monthly;
        if (pkg) {
          const { customerInfo } = await Purchases.purchasePackage(pkg);
          if (typeof customerInfo.entitlements.active['premium_access'] !== "undefined") {
            await checkEntitlements();
            navigation.goBack();
          }
        }
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('Error', e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSponsor = () => {
    navigation.goBack();
    // Use setTimeout to allow the modal to close before opening the new screen
    setTimeout(() => {
      navigation.navigate('Sponsor', {});
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="sparkles" size={48} color="#4F46E5" />
        </View>
        <Text style={styles.title}>Unlock Adulting Copilot Premium</Text>
        <Text style={styles.subtitle}>
          Get unlimited AI drafting, automated deadline reminders, and full access to our task library.
        </Text>

        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.featureText}>Unlimited AI drafts (emails, scripts)</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.featureText}>Automated deadline tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.featureText}>Saved document history</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#4F46E5" />
          ) : (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={() => handleSelfPay(false)}>
                <Text style={styles.primaryButtonText}>Subscribe for $6.99/mo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={() => handleSelfPay(true)}>
                <Text style={styles.secondaryButtonText}>Subscribe for $59.99/yr</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line} />
              </View>

              <TouchableOpacity style={styles.sponsorButton} onPress={handleSponsor}>
                <Ionicons name="gift-outline" size={20} color="#0F172A" />
                <Text style={styles.sponsorButtonText}>Ask a parent to sponsor</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  featuresList: {
    width: '100%',
    marginBottom: 40,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    marginHorizontal: 16,
    color: '#94A3B8',
    fontWeight: '600',
  },
  sponsorButton: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sponsorButtonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
});
