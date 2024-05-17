import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { resizeWidth as rw, resizeHeight as rh } from '../dimensions/Dimensions';
import { useEffect, useState } from 'react';


function HomeScreen(){
  const [menuArr,setMenuArr] = useState();

  useEffect(()=>{

    async function prepareHomeScreen() {
      try{
        menu_Arr = await AsyncStorage.getItem('SNU_MENU');
        menu_Arr = JSON.parse(menu_Arr);
        setMenuArr(menu_Arr);
      } catch(e){
        console.log(e);
      }
    }

    prepareHomeScreen();
  },[]);


  const navigation = useNavigation();
  console.log(menuArr);


  return (
    <View style={{flex: 1, height: '100%', justifyContent: 'center', backgroundColor: '#FFFFFF'}}>
        <Text style={{fontFamily: 'BodyFont-medium', fontSize: rw(20), alignSelf: 'center'}}>당신의 취향을 반영 중...</Text>
    </View>
  )
}

export default HomeScreen;