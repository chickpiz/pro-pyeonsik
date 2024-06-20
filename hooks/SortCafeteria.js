import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMEOUT = 3000;

const PERSISTENCE_KEY_LIKESTABLE = 'LIKESTABLE_';
const PERSISTENCE_KEY_DISLIKESTABLE = 'DISLIKESTABLE_';
const CATEGORY_NUMBER = 5;
const PERSISTENCE_KEY_LIKES = 'CUSTOME_LIKES';
const PERSISTENCE_KEY_DISLIKES = 'CUSTOM_DISLIKES';

function sortCafeteria() {
  const [likesTable, setLikesTable] = useState([]);
  const [dislikesTable, setDislikesTable] = useState([]);
  const [likeMenus, setLikeMenus] = useState([]);
  const [dislikeMenus, setDislikeMenus] = useState([]);
  const [complete, setComplete] = useState(false);

  useEffect(()=>{
    console.log(likesTable);
    console.log(dislikesTable);
  },[likesTable, dislikesTable])

  // load saved selections
  useEffect(()=>{
    const restoreState = async () => {
      try {
        const savedLikes = await AsyncStorage.getItem(PERSISTENCE_KEY_LIKES);
        const savedDislikes = await AsyncStorage.getItem(PERSISTENCE_KEY_DISLIKES);

        const loadedCustomDislikes = savedDislikes ? JSON.parse(savedDislikes) : [];
        const loadedCustomLikes = savedLikes ? JSON.parse(savedLikes) : [];

        setLikeMenus(loadedCustomLikes);
        setDislikeMenus(loadedCustomDislikes);

        let loadedLikesTable = likeMenus;
        let loadedDislikesTable = dislikeMenus;
        for (let i = 0; i < CATEGORY_NUMBER; i++) {
          const savedLikestable = await AsyncStorage.getItem(PERSISTENCE_KEY_LIKESTABLE+i);
          const savedDislikestable = await AsyncStorage.getItem(PERSISTENCE_KEY_DISLIKESTABLE+i);

          const loadedDislikes = savedDislikestable ? JSON.parse(savedDislikestable) : [];
          const loadedLikes = savedLikestable ? JSON.parse(savedLikestable) : [];

          loadedLikesTable = loadedLikesTable.concat(loadedLikes);
          loadedDislikesTable = loadedDislikesTable.concat(loadedDislikes);
        }

        loadedLikesTable = loadedLikesTable.concat(likeMenus);
        loadedDislikesTable = loadedDislikesTable.concat(dislikeMenus);

        setLikesTable(loadedLikesTable);
        setDislikesTable(loadedDislikesTable);
      } catch (e) {
        console.warn(e);
      } finally {
        setComplete(true);
      }
    };
    restoreState();
  }, []);
  
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve(complete)
    }, TIMEOUT)
  })
}

export default sortCafeteria;