import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SelectContext } from '../contexts/SelectContext';

const PERSISTENCE_KEY_LIKESTABLE = 'LIKESTABLE_';
const PERSISTENCE_KEY_DISLIKESTABLE = 'DISLIKESTABLE_';
const CATEGORY_NUMBER = 5;
const PERSISTENCE_KEY_LIKES = 'CUSTOME_LIKES';
const PERSISTENCE_KEY_DISLIKES = 'CUSTOM_DISLIKES';

SplashScreen.preventAutoHideAsync();

function loadResources() {
  
  const [appIsReady, setAppIsReady] = useState(false);
  const [initFinished, setInitFinished] = useState(false);

  /**
   * states to indicate which category of menu is selected
   * index mapping: [meat, fish, veget, dairy, others, custom]
   */
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [selectedDislikes, setSelectedDislikes] = useState([]);

  useEffect(() => {
    async function prepareApp() {
      //AsyncStorage.clear();
      try {
        SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          'HeadingFont': require('../assets/fonts/GmarketSansMedium.otf'),
          'ButtonFont': require('../assets/fonts/GmarketSansMedium.otf'),
          'BodyFont-medium': require('../assets/fonts/GmarketSansMedium.otf'),
          'BodyFont-light': require('../assets/fonts/Pretendard-Regular.otf'),
        });
        // TODO: Check and update current menu data (crawl web)

        // Check if the initial preference setting is finished -> set initFinished
        const savedInitFinished = await AsyncStorage.getItem('INIT_FINISHED');
        if (savedInitFinished) setInitFinished(true);

        // Check if any menu in a category has been selected
        // pre-defined likes
        for (let i = 0; i < CATEGORY_NUMBER; i++) {
          const savedLikestable = await AsyncStorage.getItem(PERSISTENCE_KEY_LIKESTABLE+i);
          const loadedLikestable = savedLikestable ? JSON.parse(savedLikestable) : [];
          const _newarr = selectedLikes;
          _newarr.push((loadedLikestable.length > 0));
          setSelectedLikes(_newarr);
        }

        // pre-defined dislikes
        for (let i = 0; i < CATEGORY_NUMBER; i++) {
          const savedDislikestable = await AsyncStorage.getItem(PERSISTENCE_KEY_DISLIKESTABLE+i);
          const loadedDislikestable = savedDislikestable ? JSON.parse(savedDislikestable) : [];
          const _newarr = selectedDislikes;
          _newarr.push((loadedDislikestable.length > 0));
          setSelectedDislikes(_newarr);
        }

        // custom likes
        const savedCustomLikes = await AsyncStorage.getItem(PERSISTENCE_KEY_LIKES);
        const loadedCustomLikes = savedCustomLikes ? JSON.parse(savedCustomLikes) : [];
        const _newarr1 = selectedLikes;
        _newarr1.push((loadedCustomLikes.length > 0));
        setSelectedLikes(_newarr1);

        // custom dislikes
        const savedCustomDislikes = await AsyncStorage.getItem(PERSISTENCE_KEY_DISLIKES);
        const loadedCustomDislikes = savedCustomDislikes ? JSON.parse(savedCustomDislikes) : [];
        const _newarr2 = selectedDislikes;
        _newarr2.push((loadedCustomDislikes.length > 0));
        setSelectedDislikes(_newarr2);

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

  return [appIsReady, initFinished, selectedLikes, selectedDislikes];
}

export default loadResources;