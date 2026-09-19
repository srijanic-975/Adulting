import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRevenueCat } from '../context/RevenueCatContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { isPremium, isSponsored, sponsorName, checkEntitlements } = useRevenueCat();

  const handleReset = async () => {
    Alert.alert(
      "Reset App",
      "Are you sure? This will delete all progress and mock purchase state.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            await checkEntitlements();
            // @ts-ignore
            navigation.replace('Onboarding');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>Current Plan</Text>

          {isPremium ? (
            <View style={styles.activePlan}>
              <View style={styles.planRow}>
                <Ionicons name="sparkles" size={24} color="#4F46E5" />
                <Text style={styles.planName}>Premium</Text>
              </View>
              {isSponsored && (
                <Text style={styles.sponsorText}>
                  Sponsored by {sponsorName || 'a parent'}
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.freePlan}>
              <Text style={styles.planName}>Free Tier</Text>
              <Text style={styles.planDesc}>Basic checklists only.</Text>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => navigation.navigate('Paywall')}
              >
                <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.settingsRow} onPress={handleReset}>
          <Ionicons name="refresh-circle-outline" size={24} color="#EF4444" />
          <Text style={styles.settingsTextDanger}>Reset Demo State</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  content: {
    padding: 24,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 32,
  },
  planTitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  activePlan: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  sponsorText: {
    marginTop: 8,
    color: '#4F46E5',
    fontWeight: '500',
  },
  freePlan: {
    gap: 8,
  },
  planDesc: {
    color: '#64748B',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 12,
  },
  settingsTextDanger: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '500',
  }
});
