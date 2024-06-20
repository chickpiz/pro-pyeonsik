import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cheerio = require('react-native-cheerio');
import Axios from 'axios';

import { SelectContext } from '../contexts/SelectContext';
import { PassThrough } from 'stream';

const PERSISTENCE_KEY_LIKESTABLE = 'LIKESTABLE_';
const PERSISTENCE_KEY_DISLIKESTABLE = 'DISLIKESTABLE_';
const CATEGORY_NUMBER = 5;
const PERSISTENCE_KEY_LIKES = 'CUSTOME_LIKES';
const PERSISTENCE_KEY_DISLIKES = 'CUSTOM_DISLIKES';

SplashScreen.preventAutoHideAsync();


async function crawlingData(date) {
  const url = `https://snuco.snu.ac.kr/foodmenu/?date=${date}&orderby=DESC`

  try{
    // get data from url
    const response = await Axios.get(url);
    const html = response.data;

    // parsing html by cheerio
    const $ = cheerio.load(html);

    const menu_data = $('.menu-table').find('tbody').children('tr');
    const menu_arr = [];
    const meal_list = ['.breakfast','.lunch','.dinner'];

    // raw_data(rest_data) => processed_data(rest_obj)
    for (var i = 0; i < menu_data.length; i++){
      rest_obj = {};
      var rest_data = $(menu_data[i]);

      var title = rest_data.find('.title').text().trim();
      var temp = title.split(" ");

      for (var j=0; j < temp.length; j++){
        if (temp[j][0] === '(' && temp[j][temp[j].length-1] === ')'){
          title = title.replace(temp[j],'');
        }
      }
      rest_obj.title = title;

      for (var j=0; j<meal_list.length; j++){
        const meal = meal_list[j]
        var txt = rest_data.find(meal_list[j]).text().trim();
        var temp = txt.split('\n');
        
        for (var k=0; k<temp.length; k++){
          var line = temp[k];
          if (line.includes('※') || line.includes("▶") || line.includes("☎") || line=='\r' || line=='' || line.includes("운영시간") || line.includes("샐러드구독문의")){
            txt = txt.replace(line,'');
          }
        }
        txt = txt.trim('\n');
        rest_obj[meal.replace('.','')] = txt;
        
      }
    menu_arr.push(rest_obj);
    }
    return menu_arr

  } catch (e){
    console.log(e);
  }
}

function getDateStr(date) {
  const dateStr = `${date.getFullYear()}-${("00"+(date.getMonth()+1).toString()).slice(-2)}-${("00"+(date.getDate()).toString()).slice(-2)}`;
  return dateStr;
}

function loadResources() {
  
  const [appIsReady, setAppIsReady] = useState(false);
  const [initFinished, setInitFinished] = useState(false);

  /**
   * states to indicate which category of menu is selected
   * index mapping: [meat, fish, veget, dairy, others, custom]
   */
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [selectedDislikes, setSelectedDislikes] = useState([]);
  const [menuResult, setMenuResult] = useState({});

  useEffect(() => {
    async function prepareApp() {
      AsyncStorage.clear();
      try {
        SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          'HeadingFont': require('../assets/fonts/GmarketSansMedium.otf'),
          'ButtonFont': require('../assets/fonts/GmarketSansMedium.otf'),
          'BodyFont-medium': require('../assets/fonts/GmarketSansMedium.otf'),
          'BodyFont-light': require('../assets/fonts/Pretendard-Regular.otf'),
        });

        // Check and update current menu data (crawl web)
        var snuMenu = await AsyncStorage.getItem('SNU_MENU');
        snuMenu = (snuMenu) ? JSON.parse(snuMenu) : {};
        var isChanged = false;
        
        const today = new Date();
        const yesterday = new Date(today);
        const tomorrow = new Date(today);
        yesterday.setDate(today.getDate()-1);
        tomorrow.setDate(today.getDate()+1)
        const dateList = [yesterday,today,tomorrow];
        const dateStrList = dateList.map((date)=>getDateStr(date));
        var result = {}
        
        for (var i = 0; i<dateStrList.length; i++){
          var date = dateStrList[i];
          result[date] = snuMenu[date] ? snuMenu[date]: await crawlingData(date); 
        }
        setMenuResult(result);

        await AsyncStorage.setItem('SNU_MENU',JSON.stringify(result),() => {
          console.log('저장 완료')});


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

  return [appIsReady, initFinished, selectedLikes, selectedDislikes, menuResult];
}

export default loadResources;