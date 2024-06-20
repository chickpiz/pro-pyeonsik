import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { resizeWidth as rw, resizeHeight as rh } from '../dimensions/Dimensions';
import { Colors } from '../assets/colors/Colors';

const PERSISTENCE_KEY_LIKESTABLE = 'LIKESTABLE_';
const PERSISTENCE_KEY_DISLIKESTABLE = 'DISLIKESTABLE_';
const CATEGORY_NUMBER = 5;
const PERSISTENCE_KEY_LIKES = 'CUSTOME_LIKES';
const PERSISTENCE_KEY_DISLIKES = 'CUSTOM_DISLIKES';

const TEXT_APPLYING = '당신의 취향을 반영 중...';

const ApplyPreference = () => {
  const navigation = useNavigation();

  const [sortComplete, setSortComplete] = useState(false);

  const [likesTable, setLikesTable] = useState([]);
  const [dislikesTable, setDislikesTable] = useState([]);
  const [complete, setComplete] = useState(false);

  // load saved selections
  useEffect(()=>{
    const restoreState = async () => {
      try {
        const savedLikes = await AsyncStorage.getItem(PERSISTENCE_KEY_LIKES);
        const savedDislikes = await AsyncStorage.getItem(PERSISTENCE_KEY_DISLIKES);

        const loadedCustomDislikes = savedDislikes ? JSON.parse(savedDislikes) : [];
        const loadedCustomLikes = savedLikes ? JSON.parse(savedLikes) : [];

        let loadedLikesTable = loadedCustomLikes;
        let loadedDislikesTable = loadedCustomDislikes;
        for (let i = 0; i < CATEGORY_NUMBER; i++) {
          const savedLikestable = await AsyncStorage.getItem(PERSISTENCE_KEY_LIKESTABLE+i);
          const savedDislikestable = await AsyncStorage.getItem(PERSISTENCE_KEY_DISLIKESTABLE+i);

          const loadedDislikes = savedDislikestable ? JSON.parse(savedDislikestable) : [];
          const loadedLikes = savedLikestable ? JSON.parse(savedLikestable) : [];

          loadedLikesTable = loadedLikesTable.concat(loadedLikes);
          loadedDislikesTable = loadedDislikesTable.concat(loadedDislikes);
        }
        setLikesTable(loadedLikesTable);
        setDislikesTable(loadedDislikesTable);
      } catch (e) {
        console.warn(e);
      }
    };
    restoreState().then((data)=>{
      setTimeout(() => {
        setComplete(true);
      }, 500)
    });
  }, []);

  useEffect(()=>{
    if (complete) {
      console.log(likesTable);
      console.log(dislikesTable);
    }
  },[complete]);

  useEffect(()=>{
    if (sortComplete) {
      navigation.navigate('HomeScreen'); 
      navigation.reset({routes: [{name: 'HomeScreen'}]});
    }
  },[sortComplete]);

  return (
    <View style={{flex: 1, height: '100%', justifyContent: 'center', backgroundColor: Colors.backGround}}>
        <Text style={{fontFamily: 'BodyFont-medium', fontSize: rw(20), alignSelf: 'center'}}>{TEXT_APPLYING}</Text>
    </View>
  )
}

export default ApplyPreference;