import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { subscribeToAuthChanges } from '../services/authServices';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
        if (user) {
            router.replace('/(tabs)/home');
        } else {
            router.replace('/');
        }
    });
    
    return () => unsubscribe();
}, []);
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
