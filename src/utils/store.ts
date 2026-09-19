// Mock Serverless Key-Value Store for Sponsor Codes
// In a real app, this would use a database like Supabase or Firebase.
// For the demo, we'll store this in memory, and sync to AsyncStorage to persist across reloads.
import AsyncStorage from '@react-native-async-storage/async-storage';

const SPONSOR_CODES_KEY = '@sponsor_codes';

interface SponsorMapping {
  childAppUserId: string;
  createdAt: number;
}

export const generateSponsorCode = async (childAppUserId: string): Promise<string> => {
  // Generate a short code like SPONSOR-7F2A
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  const code = `SPONSOR-${randomChars}`;

  try {
    const existingStr = await AsyncStorage.getItem(SPONSOR_CODES_KEY);
    const codes = existingStr ? JSON.parse(existingStr) : {};

    codes[code] = {
      childAppUserId,
      createdAt: Date.now()
    };

    await AsyncStorage.setItem(SPONSOR_CODES_KEY, JSON.stringify(codes));
    return code;
  } catch (error) {
    console.error('Error generating sponsor code:', error);
    return code; // Fallback, won't persist across reloads though
  }
};

export const getChildUserIdFromCode = async (code: string): Promise<string | null> => {
  try {
    const existingStr = await AsyncStorage.getItem(SPONSOR_CODES_KEY);
    if (!existingStr) return null;

    const codes = JSON.parse(existingStr);
    const mapping = codes[code];

    if (mapping && mapping.childAppUserId) {
      return mapping.childAppUserId;
    }
    return null;
  } catch (error) {
    console.error('Error reading sponsor code:', error);
    return null;
  }
};
