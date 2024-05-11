import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

function loadResources() {
  
  const [appIsReady, setAppIsReady] = useState(false);
  const [initFinished, setInitFinished] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      //AsyncStorage.clear();
      try {
        SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
          'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
        });
        // TODO: Check and update current menu data (crawl web)

        // Check if the initial preference setting is finished -> set initFinished
        const savedInitFinished = await AsyncStorage.getItem('INIT_FINISHED');
        if (savedInitFinished) setInitFinished(true);
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

  return [appIsReady, initFinished];
}

export default loadResources;