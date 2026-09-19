import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RevenueCatProvider } from './src/context/RevenueCatContext';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    preseedData();
  }, []);

  const preseedData = async () => {
    try {
      const hasSeeded = await AsyncStorage.getItem('@has_seeded');
      if (!hasSeeded) {
        // Pre-seed Onboarding
        await AsyncStorage.setItem('@has_onboarded', 'true');
        await AsyncStorage.setItem('@user_life_stage', 'New Job');

        // Pre-seed Completed Task (e.g. Set up 401(k))
        const taskProgress = { s1: true, s2: true, s3: true, s4: true };
        await AsyncStorage.setItem('@task_progress_t_work_1', JSON.stringify(taskProgress));
        await AsyncStorage.setItem('@task_completed_t_work_1', 'true');

        // Pre-seed Draft History
        const sampleHistory = [{
          taskId: 't_money_1',
          taskTitle: 'Dispute a bank fee',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          content: "Subject: Request to waive overdraft fee\n\nDear Chase Bank,\n\nI noticed a $35 overdraft fee on my account on 9/12. As a customer for 3 years, I kindly request this be waived as a one-time courtesy.\n\nThanks,\nJane"
        }];
        await AsyncStorage.setItem('@draft_history', JSON.stringify(sampleHistory));

        // Pre-seed Premium Status (Sponsored by Mom)
        await AsyncStorage.setItem('@mock_premium', 'true');
        await AsyncStorage.setItem('@is_sponsored', 'true');
        await AsyncStorage.setItem('@sponsor_name', 'Mom');

        await AsyncStorage.setItem('@has_seeded', 'true');
      }
    } catch (e) {
      console.error('Error pre-seeding data', e);
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <RevenueCatProvider>
      <AppNavigator />
    </RevenueCatProvider>
  );
}
