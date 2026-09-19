import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens (will be implemented in later steps)
import OnboardingScreen from '../screens/OnboardingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TaskLibraryScreen from '../screens/TaskLibraryScreen';
import TaskFlowScreen from '../screens/TaskFlowScreen';
import RemindersScreen from '../screens/RemindersScreen';
import ProfileScreen from '../screens/ProfileScreen'; // handles self-pay and sponsor setup
import SponsorScreen from '../screens/SponsorScreen'; // parent-facing screen
import PaywallScreen from '../screens/PaywallScreen'; // dedicated paywall modal

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  TaskFlow: { taskId: string };
  Sponsor: { code?: string };
  Paywall: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Library: undefined;
  Reminders: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Reminders') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5', // Indigo-600
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Library" component={TaskLibraryScreen} />
      <Tab.Screen name="Reminders" component={RemindersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="TaskFlow" component={TaskFlowScreen} options={{ title: 'Task Details' }} />
        <Stack.Screen name="Sponsor" component={SponsorScreen} options={{ title: 'Sponsor Premium' }} />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="Paywall" component={PaywallScreen} options={{ headerShown: false }} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
