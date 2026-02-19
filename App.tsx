import React, { useState, useEffect } from 'react';
import { Text, TextInput, StatusBar, Platform } from 'react-native';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useFonts, Inter_300Light, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SplashScreen } from './src/components/SplashScreen';

// Set default font family for all Text components
if (Text.defaultProps == null) {
  Text.defaultProps = {};
}
Text.defaultProps.style = { fontFamily: 'Inter_400Regular' };

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
}
TextInput.defaultProps.style = { fontFamily: 'Inter_400Regular' };

// Keep the splash screen visible while we fetch resources
SplashScreenExpo.preventAutoHideAsync();

// StatusBar Manager Component
const StatusBarManager = () => {
  const { theme } = useTheme();
  
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
    StatusBar.setBarStyle(theme.id === 'light' ? 'dark-content' : 'light-content', true);
  }, [theme.id]);

  return null;
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (!fontsLoaded) return;
        
        // Simulate loading (you can add actual resource loading here)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreenExpo.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded]);

  if (!appIsReady) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBarManager />
        <RootNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
