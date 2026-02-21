import React, { useState, useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import * as SplashScreenExpo from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SplashScreen } from './src/components/SplashScreen';
import AuthService from './src/services/AuthService';

// San Francisco (SF Pro) is the default iOS system font
// React Native automatically uses it, no need to load custom fonts

// Keep the splash screen visible while we fetch resources
SplashScreenExpo.preventAutoHideAsync();

// StatusBar Manager Component
const StatusBarManager = () => {
  const { theme } = useTheme();
  
  useEffect(() => {
    const updateStatusBar = async () => {
      const barStyle = theme.id === 'light' ? 'dark-content' : 'light-content';
      
      // Set root background color
      if (Platform.OS === 'android') {
        await SystemUI.setBackgroundColorAsync('transparent');
      }
      
      // Set status bar style
      StatusBar.setBarStyle(barStyle, true);
      
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor('transparent');
      }
    };
    
    updateStatusBar();
  }, [theme.id]);

  return (
    <StatusBar 
      barStyle={theme.id === 'light' ? 'dark-content' : 'light-content'}
      backgroundColor="transparent"
      translucent={true}
    />
  );
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('🚀 Initializing Firebase...');
        
        // Initialize Firebase Authentication
        await AuthService.signInAnonymously();
        console.log('✅ Firebase Authentication initialized');
        
        // Wait for auth to be ready
        await AuthService.waitForAuth();
        console.log('✅ User authenticated:', AuthService.getCurrentUserId());
        
        // Simulate loading (you can add actual resource loading here)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.error('❌ Firebase initialization error:', e);
      } finally {
        setAppIsReady(true);
        await SplashScreenExpo.hideAsync();
      }
    }

    prepare();
  }, []);

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
