import React, { createContext, useContext, useState, useEffect } from 'react';
import Purchases, { CustomerInfo } from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface RevenueCatContextState {
  isPremium: boolean;
  isSponsored: boolean;
  sponsorName: string | null;
  appUserId: string | null;
  loading: boolean;
  checkEntitlements: () => Promise<void>;
}

const RevenueCatContext = createContext<RevenueCatContextState>({
  isPremium: false,
  isSponsored: false,
  sponsorName: null,
  appUserId: null,
  loading: true,
  checkEntitlements: async () => {},
});

export const useRevenueCat = () => useContext(RevenueCatContext);

export const RevenueCatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsorName, setSponsorName] = useState<string | null>(null);
  const [appUserId, setAppUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initPurchases();
  }, []);

  const initPurchases = async () => {
    try {
      // In a real app, inject this via env vars
      const apiKey = Platform.OS === 'ios' ? 'appl_dummy_key' : 'goog_dummy_key';

      // We will skip full initialization if running on web for Expo preview,
      // but setup mock state instead
      if (Platform.OS === 'web') {
        const mockPremium = await AsyncStorage.getItem('@mock_premium');
        const mockSponsored = await AsyncStorage.getItem('@is_sponsored');
        const mockSponsorName = await AsyncStorage.getItem('@sponsor_name');

        setIsPremium(mockPremium === 'true');
        setIsSponsored(mockSponsored === 'true');
        setSponsorName(mockSponsorName);
        setAppUserId('mock_user_id');
        setLoading(false);
        return;
      }

      Purchases.configure({ apiKey });

      const customerInfo = await Purchases.getCustomerInfo();
      setAppUserId(await Purchases.getAppUserID());

      Purchases.addCustomerInfoUpdateListener(info => {
        updateStateFromInfo(info);
      });

      updateStateFromInfo(customerInfo);
    } catch (e) {
      console.error('Error initializing RevenueCat', e);
    } finally {
      setLoading(false);
    }
  };

  const updateStateFromInfo = (info: CustomerInfo) => {
    const premium = typeof info.entitlements.active['premium_access'] !== 'undefined';
    setIsPremium(premium);

    // Check attributes for sponsor info (for native flow)
    // Actually attributes are usually fetched separately or kept locally in sync,
    // for this demo we'll just check local storage as a fallback too
  };

  const checkEntitlements = async () => {
    if (Platform.OS === 'web') {
      const mockPremium = await AsyncStorage.getItem('@mock_premium');
      const mockSponsored = await AsyncStorage.getItem('@is_sponsored');
      const mockSponsorName = await AsyncStorage.getItem('@sponsor_name');
      setIsPremium(mockPremium === 'true');
      setIsSponsored(mockSponsored === 'true');
      setSponsorName(mockSponsorName);
      return;
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      updateStateFromInfo(customerInfo);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <RevenueCatContext.Provider value={{ isPremium, isSponsored, sponsorName, appUserId, loading, checkEntitlements }}>
      {children}
    </RevenueCatContext.Provider>
  );
};
