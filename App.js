import React, { useContext, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { SelectContext } from './contexts/SelectContext';
import Navigation from './navigation/Index';
import loadResources from './hooks/LoadResources';
import useColorScheme from './hooks/UseColorScheme';

export default function App() {
  const [isLoadingComplete, initFinished, selectedLikes, selectedDislikes] = loadResources();
  const colorScheme = useColorScheme();

  const [likes, setLikes] = useState(selectedLikes);
  const [dislikes, setDislikes] = useState(selectedDislikes);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SelectContext.Provider value={{ 
        likes: likes, 
        dislikes: dislikes, 
        setLikes: setLikes, 
        setDislikes: setDislikes }}>
        <SafeAreaProvider>
          <Navigation 
            initFinished={initFinished}
            colorScheme={colorScheme}
          />
          <StatusBar />
        </SafeAreaProvider>
      </SelectContext.Provider>
    );
  }
}