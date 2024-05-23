import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { resizeWidth as rw, resizeHeight as rh } from '../dimensions/Dimensions';
import { useContext, useEffect, useState } from 'react';
import { Colors } from '../assets/colors/Colors';
import { MenuContext } from '../contexts/MenuContext';

//HomeScreen text

const TEXT_HEADING = "취향 맞춤 식당";
const TEXT_FOOTER = "음식취향 수정하기";
const mealText = ["아침", "점심", "저녁"];
const mealId = ["breakfast","lunch","dinner"];
const weekDay = ['일', '월', '화', '수', '목', '금', '토'];

function getDateStr(date) {
  const dateStr = `${date.getFullYear()}/${("00"+(date.getMonth()+1).toString()).slice(-2)}/${("00"+(date.getDate()).toString()).slice(-2)} (${weekDay[date.getDay()]})`
  return dateStr;
}

function getDateId(date) {
  const dateStr = `${date.getFullYear()}-${("00"+(date.getMonth()+1).toString()).slice(-2)}-${("00"+(date.getDate()).toString()).slice(-2)}`;
  return dateStr;
}
/*
'HeadingFont': require('../assets/fonts/GmarketSansMedium.otf'),
          'ButtonFont': require('../assets/fonts/GmarketSansMedium.otf'),
          'BodyFont-medium': require('../assets/fonts/GmarketSansMedium.otf'),
          'BodyFont-light': require('../assets/fonts/Pretendard-Regular.otf'),
   */

function HomeScreen(){
  const navigation = useNavigation();

  const [dateIdx, setDateIdx] = useState(1);
  const [dateList, setDateList] = useState([]);
  const [dateIdList, setDateIdList] = useState([]);
  const [currentMeal, setCurrentMeal] = useState("breakfast");
  const [mealButtonArr, setMealButtonArr] = useState([]);
  const [dietList, setDietList] = useState([]);

  const menuObj = useContext(MenuContext);
  
  //set date
  useEffect(()=>{
    function prepareHomeScreen() {
      const today = new Date();
      const yesterday = new Date(today);
      const tomorrow = new Date(today);
      yesterday.setDate(today.getDate()-1);
      tomorrow.setDate(today.getDate()+1)

      const todayStr = getDateStr(today);
      const yesterdayStr = getDateStr(yesterday);
      const tomorrowStr = getDateStr(tomorrow);

      const todayId = getDateId(today);
      const yesterdayId = getDateId(yesterday);
      const tomorrowId = getDateId(tomorrow);

      const dateList = [];
      const dateIdList = [];

      dateList.push(yesterdayStr);
      dateList.push(todayStr);
      dateList.push(tomorrowStr);

      dateIdList.push(yesterdayId);
      dateIdList.push(todayId);
      dateIdList.push(tomorrowId);

      setDateList(dateList);
      setDateIdList(dateIdList);
    }
    prepareHomeScreen();
  },[]);

  //create meal_button_arr
  useEffect(()=>{
    const buttons = [];
    function createMealButtonArr() {
      for (var i = 0; i < 3; i++){
        let id = mealId[i];
        let text = mealText[i];

        buttons.push(
          <Pressable key={id} onPress={()=>{setCurrentMeal(id)}} style={({pressed})=> [
            styles.meal_button,
            (pressed) ? {opacity: 0.8}: {},
            (currentMeal===id) ? {backgroundColor: Colors.emphasize} : {}
          ]}>
            <Text style={styles.meal_button_txt}>{text}</Text>
          </Pressable>
        );
      }
      setMealButtonArr(buttons);
    }
    createMealButtonArr();
  },[currentMeal])

  //create diet list
  useEffect(()=>{
    function createDietList() {
      const dietList = [];
      const oneDayMenu = menuObj[dateIdList[dateIdx]];

      if (oneDayMenu){
        for (var i = 0; i < oneDayMenu.length; i++) {
          const restMenu = oneDayMenu[i];
          const restTitle = restMenu["title"];
          const dietContent = restMenu[currentMeal];
          console.log(dietContent)
          if (dietContent){
            dietList.push(
              <View key={`diet${i}`} style={styles.diet}>
                <Text style={styles.diet_title}>{restTitle}</Text>
                <Text style={styles.diet_content}>{dietContent}</Text>
              </View>
            )
          }
      }
      }

      setDietList(dietList);
    }
    createDietList();
  }, [dateIdx, dateIdList, currentMeal])


  return (
    <View style={styles.container}>
        <Text style={styles.text_heading}>{TEXT_HEADING}</Text>
        <View style={styles.show_date}>
          <Pressable onPress={()=>{(dateIdx!==0)&&setDateIdx(dateIdx-1)}}>
            <Text style={styles.arrow}>{'<'}</Text>
          </Pressable>
          <Text style={styles.date_text}>{dateList[dateIdx]}</Text>
          <Pressable onPress={()=>{(dateIdx!==dateList.length-1)&&setDateIdx(dateIdx+1)}}>
            <Text style={styles.arrow}>{'>'}</Text>
          </Pressable>
        </View>
        <View style={styles.show_meal}>{mealButtonArr}</View>
        <View style={styles.diet_container}>
          <ScrollView overflow='scroll' scrollEnabled={true}>{dietList}</ScrollView>
        </View>
        <View style={styles.footer}>
          <Pressable style={styles.footer_button}>
            <Text style={styles.footer_text} onPress={()=>{navigation.navigate('SelectPreference')}}>{TEXT_FOOTER}</Text>
          </Pressable>
        </View>
    </View>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backGround
  },
  text_heading: {
    fontFamily: "HeadingFont",
    fontSize: rw(25),
    textAlign: "center",
    marginTop: rh(94),
  },
  show_date: {
    flexDirection:'row',
    marginTop: rh(14),
    width: rw(248),
    height: rh(26),
    alignSelf: 'center',
    justifyContent:'space-between',
    alignContent:'center',
  },
  date_text: {
    fontFamily:'HeadingFont',
    fontSize: rw(16),
    textAlign: 'center',
    marginHorizontal: rw(14),
    alignSelf: 'center',
    marginTop: rh(5)
  },
  arrow: {
    fontFamily:'HeadingFont',
    fontSize: rw(30),
    textAlign: 'center',
    marginHorizontal: rw(10),
    alignSelf: 'center'
  },
  show_meal: {
    flexDirection: 'row',
    marginTop: rh(10),
    width: rw(245),
    height: rh(54),
    alignSelf:'center',
    justifyContent:'center',
    alignContent: 'center', 
    paddingHorizontal: rw(7),
  },
  meal_button:{
    backgroundColor: Colors.button,
    marginTop: rh(8),
    width: rw(71),
    height: rh(38),
    marginHorizontal: rw(3),
    justifyContent:'center',
    borderRadius: rw(15),
    borderWidth: 1
  },
  meal_button_txt: {
    fontFamily:'ButtonFont',
    fontSize: rw(16),
    textAlign: 'center',
  },
  diet_container: {
    marginTop: rh(14),
    width: '100%',
    height: rh(575),
  },
  diet: {
    backgroundColor: Colors.button,
    borderWidth: 1,
    marginHorizontal: rw(30),
    marginBottom: rh(17),
    borderRadius: rw(20),
    flexBasis: rh(0)
  },
  diet_title: {
    marginTop: rh(30),
    marginLeft: rw(20),
    fontFamily: 'BodyFont-medium',
    fontSize: rw(22)
  },
  diet_content: {
    marginTop: rh(16),
    marginLeft: rw(20),
    marginBottom: rh(30),
    fontFamily: 'BodyFont-medium',
    fontSize: rw(16),
    lineHeight: rh(28),
  },
  footer:{
    width: rw(230),
    height: rh(54),
    marginLeft: rw(180),
    marginRight: rw(20),
    marginTop: rh(25),
  },
  footer_button:{
    width: rw(210),
    height: rh(38),
    borderRadius: rw(15),
    marginHorizontal: rw(10),
    marginVertical: rh(8),
    backgroundColor: Colors.button,
    borderWidth: 1,
    justifyContent: 'center'
  },
  footer_text:{
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'ButtonFont',
    fontSize: rw(20)
  }

})