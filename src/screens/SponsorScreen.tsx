import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Share, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from 'react-native-purchases';
import { generateSponsorCode, getChildUserIdFromCode } from '../utils/store';
import { useRevenueCat } from '../context/RevenueCatContext';

export default function SponsorScreen() {
  const navigation = useNavigation();
  const { appUserId, checkEntitlements } = useRevenueCat();

  const [loading, setLoading] = useState(true);
  const [sponsorCode, setSponsorCode] = useState('');

  // Simulated parent view state
  const [isParentView, setIsParentView] = useState(false);
  const [parentLoading, setParentLoading] = useState(false);

  useEffect(() => {
    initSponsor();
  }, []);

  const initSponsor = async () => {
    if (!appUserId) {
      setLoading(false);
      return;
    }
    const code = await generateSponsorCode(appUserId);
    setSponsorCode(code);
    setLoading(false);
  };

  const handleShare = async () => {
    const message = `Can you sponsor my Adulting Copilot Premium plan? Use code: ${sponsorCode}`;
    try {
      await Share.share({ message });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const simulateParentPurchase = async () => {
    setParentLoading(true);
    try {
      if (Platform.OS === 'web') {
        // Mock web flow
        await AsyncStorage.setItem('@mock_premium', 'true');
        await AsyncStorage.setItem('@is_sponsored', 'true');
        await AsyncStorage.setItem('@sponsor_name', 'Mom');

        await checkEntitlements();
        Alert.alert("Success!", "Demo: The child's account was successfully upgraded.");
        navigation.goBack();
        return;
      }

      // Real flow for demo:
      const childId = await getChildUserIdFromCode(sponsorCode);
      if (!childId) {
         throw new Error("Invalid sponsor code.");
      }

      // 1. Parent logs in as child
      await Purchases.logIn(childId);

      // 2. Parent purchases the sponsor product
      const offerings = await Purchases.getOfferings();
      const pkg = offerings.all?.default?.monthly; // Simplified, in reality would look for _sponsor package

      if (pkg) {
        await Purchases.purchasePackage(pkg);

        // 3. Set attributes indicating it's sponsored
        await Purchases.setAttributes({
          sponsor_name: "Mom",
          is_sponsored: "true"
        });

        await checkEntitlements();
        Alert.alert("Success!", "Demo: The child's account was successfully upgraded.");
        navigation.goBack();
      } else {
         throw new Error("No products available.");
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert("Error", e.message);
      }
    } finally {
      setParentLoading(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  }

  if (isParentView) {
    return (
      <SafeAreaView style={styles.parentContainer}>
        <View style={styles.parentContent}>
          <Ionicons name="shield-checkmark" size={64} color="#10B981" />
          <Text style={styles.parentTitle}>Sponsor a Premium Plan</Text>
          <Text style={styles.parentSubtitle}>
            You are about to purchase Adulting Copilot Premium for the child account linked to code:
          </Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{sponsorCode}</Text>
          </View>
          <Text style={styles.parentNote}>
            This grants full premium access (unlimited AI drafts, reminders) to the child's account. You will be billed $6.99/mo.
          </Text>

          <TouchableOpacity
            style={[styles.primaryButton, parentLoading && styles.disabledButton]}
            onPress={simulateParentPurchase}
            disabled={parentLoading}
          >
            {parentLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Complete Purchase</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsParentView(false)}>
            <Text style={styles.cancelButtonText}>Cancel Demo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="people" size={48} color="#4F46E5" />
        </View>
        <Text style={styles.title}>Ask a Parent to Sponsor</Text>
        <Text style={styles.subtitle}>
          Send this code to a parent or guardian. When they complete the purchase, your app will automatically upgrade to Premium.
        </Text>

        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>YOUR SPONSOR CODE</Text>
          <Text style={styles.codeValue}>{sponsorCode}</Text>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color="#FFFFFF" />
          <Text style={styles.shareButtonText}>Share Code</Text>
        </TouchableOpacity>

        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Hackathon Demo Action:</Text>
          <TouchableOpacity style={styles.demoButton} onPress={() => setIsParentView(true)}>
            <Text style={styles.demoButtonText}>Simulate Parent Screen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
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
    marginTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  codeContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    borderStyle: 'dashed',
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  codeValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 2,
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  demoSection: {
    marginTop: 64,
    padding: 20,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    width: '100%',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoButton: {
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Parent View Styles
  parentContainer: {
    flex: 1,
    backgroundColor: '#0F172A', // Formal dark theme for parent
  },
  parentContent: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 16,
  },
  parentSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  codeBox: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  codeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#38BDF8',
  },
  parentNote: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    padding: 16,
  },
  cancelButtonText: {
    color: '#94A3B8',
    fontWeight: '600',
  },
});
