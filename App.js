import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from './navigation/Index';
import loadResources from './hooks/LoadResources';
import useColorScheme from './hooks/UseColorScheme';

export default function App() {
  const [isLoadingComplete, initFinished] = loadResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation 
          initFinished={initFinished}
          colorScheme={colorScheme}
        />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}