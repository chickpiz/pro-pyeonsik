import React, { useContext, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SelectContext } from './contexts/SelectContext';
import Navigation from './navigation/Index';
import loadResources from './hooks/LoadResources';
import useColorScheme from './hooks/UseColorScheme';
import { MenuContext } from './contexts/MenuContext';

export default function App() {
  const [isLoadingComplete, initFinished, selectedLikes, selectedDislikes, menuResult] = loadResources();
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
        dispatchLikes: setLikes, 
        dispatchDislikes: setDislikes }}>
        <MenuContext.Provider value={menuResult}>
          <SafeAreaProvider>
            <Navigation 
              initFinished={initFinished}
              colorScheme={colorScheme}
            />
            <StatusBar />
          </SafeAreaProvider>
        </MenuContext.Provider>
      </SelectContext.Provider>
    );
  }
}