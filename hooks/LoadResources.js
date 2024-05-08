import { useEffect, useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

SplashScreen.preventAutoHideAsync();

function loadResources() {
  
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        SplashScreen.preventAutoHideAsync();
        await Font.loadAsync(Entypo.font);
        await Font.loadAsync({
          'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
          'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
        });
        // TODO: Check and update current menu data
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        SplashScreen.hideAsync()
      }
    }

    prepareApp();
  }, []);

  return appIsReady;
}

export default loadResources;