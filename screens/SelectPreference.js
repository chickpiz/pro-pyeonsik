import { useState, useEffect, useContext } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BackHandler } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SelectContext } from '../contexts/SelectContext';
import { resizeWidth as rw, resizeHeight as rh } from '../dimensions/Dimensions';
import { Colors } from '../assets/colors/Colors';

const TEXT_HEADING_LIKES = '좋아하는 음식을 알려주세요.';
const TEXT_HEADING_DISLIKES = '피하고 싶은 음식을 알려주세요.';
const TEXT_BODY = '취향을 반영해 식당 메뉴를 나열해 드려요.\n중복 선택, 또는 선택 없이 넘어가기가 가능해요.';

const TEXT_MEAT = '고기';
const TEXT_FISH = '생선';
const TEXT_VEGET = '야채';
const TEXT_DAIRY = '계란 및 유제품';
const TEXT_OTHERS = '기타';
const TEXT_CUSTOM = '+직접 입력';
const TEXT_NEXT = '다음';
const TEXT_JUMP = '건너뛰기';
const TEXT_RESULT = '결과 보기';

const CATEGORY_MEAT = 0;
const CATEGORY_FISH = 1;
const CATEGORY_VEGET = 2;
const CATEGORY_DAIRY = 3;
const CATEGORY_OTHERS = 4;

const SelectPreference = () => {

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  /**
   * mode == true: select likes
   * mode == false: select dislikes
   */
  const [mode, setMode] = useState(true);
  const [initFinished, setInitFinished] = useState(false);

  /**
   * selected: indicates if any menu has been selected as likes or dislikes
   */
  const [selectedLikes, setSelectedLikes] = useState(false);
  const [selectedDislikes, setSelectedDislikes] = useState(false);
  const {likes, dislikes} = useContext(SelectContext);
  const [selected, setSelected] = useState([]);

  useEffect(()=>{
    if (mode) setSelected(likes);
    else setSelected(dislikes);
  }, [mode])

  useEffect(()=>{
    for (let i = 0; i < 6; i++) {
      if (mode && likes[i]) {
        setSelectedLikes(true); 
        return;
      } else if (!mode && dislikes[i]) {
        setSelectedDislikes(true);
        return;
      }
    }
    if (mode) setSelectedLikes(false); 
    else setSelectedDislikes(false);
  }, [isFocused])

  useEffect(()=>{
    for (let i = 0; i < 6; i++) {
      if (mode && likes[i]) {
        setSelectedLikes(true); 
        return;
      } else if (!mode && dislikes[i]) {
        setSelectedDislikes(true);
        return;
      }
    }
    if (mode) setSelectedLikes(false); 
    else setSelectedDislikes(false);
  }, [])

  const handleBack = () => {
    if(isFocused && !mode) setMode(true);
    else return false;
    return true;
  }

  useEffect(()=>{
    BackHandler.addEventListener('hardwareBackPress', handleBack);
    return(()=>BackHandler.removeEventListener('hardwareBackPress', handleBack))
  }, [handleBack]);

  const navigateTo = (_category) => {
    if (_category < 0) {
      navigation.navigate(
        'AddCustomMenu',
        {
          mode: mode
        }
      );
      return;
    }
    navigation.navigate(
      'SelectMenu',
      {
        mode: mode,
        category: _category,
      }
    );
  }

  const navigateToHome = () => {
    setInitFinished(true);
    AsyncStorage.setItem('INIT_FINISHED', JSON.stringify(initFinished));
    navigation.navigate('ApplyPreference'); 
    navigation.reset({routes: [{name: 'ApplyPreference'}]});
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text_heading}>{mode ? TEXT_HEADING_LIKES : TEXT_HEADING_DISLIKES}</Text>
      <Text style={styles.text_body}>{TEXT_BODY}</Text> 
      <View style={styles.container_category_buttons}>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, 
          selected[0] ? styles.button_category_selected : styles.button_category]} 
          onPress={()=>navigateTo(CATEGORY_MEAT)}>
          <Text style={[{color: selected[0] ? Colors.white : Colors.black}, styles.text_button]}>{TEXT_MEAT}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, 
          selected[1] ? styles.button_category_selected : styles.button_category]} 
          onPress={()=>navigateTo(CATEGORY_FISH)}>
          <Text style={[{color: selected[1] ? Colors.white : Colors.black}, styles.text_button]}>{TEXT_FISH}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, 
          selected[2] ? styles.button_category_selected : styles.button_category]} 
          onPress={()=>navigateTo(CATEGORY_VEGET)}>
          <Text style={[{color: selected[2] ? Colors.white : Colors.black}, styles.text_button]}>{TEXT_VEGET}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, 
          selected[3] ? styles.button_category_selected : styles.button_category]} 
          onPress={()=>navigateTo(CATEGORY_DAIRY)}>
          <Text style={[{color: selected[3] ? Colors.white : Colors.black}, styles.text_button]}>{TEXT_DAIRY}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, 
          selected[4] ? styles.button_category_selected : styles.button_category]} 
          onPress={()=>navigateTo(CATEGORY_OTHERS)}>
          <Text style={[{color: selected[4] ? Colors.white : Colors.black}, styles.text_button]}>{TEXT_OTHERS}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, 
          selected[5] ? styles.button_category_selected : styles.button_category]} 
          onPress={()=>navigateTo(-1)}>
          <Text style={[{color: selected[5] ? Colors.white : Colors.black}, styles.text_button]}>{TEXT_CUSTOM}</Text>
        </Pressable>
      </View>
      <Pressable 
        style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, 
        mode ? (selectedLikes || selectedDislikes? styles.button_next : styles.button_jump)
            : (selectedLikes || selectedDislikes? styles.button_result : styles.button_jump)]}
        onPress={()=>{mode ? setMode(false) : navigateToHome()}}>
          <Text style={styles.text_button}>
            {mode ? (selectedLikes || selectedDislikes? TEXT_NEXT : TEXT_JUMP)
            : (selectedLikes || selectedDislikes? TEXT_RESULT : TEXT_JUMP)}
          </Text>
      </Pressable>
    </View>
  )
}

export default SelectPreference;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backGround,
  },
  container_category_buttons: {
    alignContent: 'center',
    width: rw(333),
    height: rh(489),
    backgroundColor: Colors.backGround,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: rh(41),
    gap: rh(17),
  },
  text_heading: {
    fontFamily: 'HeadingFont',
    fontSize: rw(25),
    textAlign: 'center',
    marginTop: rh(145),
  },
  text_body: {
    fontFamily: 'BodyFont-light',
    fontSize: rw(17),
    color: Colors.bodyTextLight,
    textAlign: 'left',
    alignSelf: 'center',
    marginTop: rh(20),
  },
  text_button: {
    fontFamily: 'ButtonFont',
    textAlign: 'center',
    alignSelf:'center',
    fontSize: rw(20),
  },
  button_category: {
    borderWidth: 1,
    borderColor: Colors.black,
    backgroundColor: Colors.button,
    borderRadius: rw(25),
    width: rw(333),
    height: rh(67),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button_category_selected: {
    borderWidth: 1,
    borderColor: Colors.black,
    backgroundColor: Colors.emphasize,
    borderRadius: rw(25),
    width: rw(333),
    height: rh(67),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button_next: {
    borderWidth: 1,
    borderColor: Colors.black,
    backgroundColor: Colors.button,
    borderRadius: rw(15),
    justifyContent: 'center',
    marginTop: rh(86),
    marginBottom: rh(40),
    marginLeft: rw(311),
    marginRight: rw(30),
    paddingTop: rh(8),
    paddingBottom: rh(8),
    paddingLeft: rw(10),
    paddingRight: rw(10),
  },
  button_jump: {
    borderWidth: 1,
    borderColor: Colors.black,
    backgroundColor: Colors.button,
    borderRadius: rw(15),
    justifyContent: 'center',
    marginTop: rh(86),
    marginBottom: rh(40),
    marginLeft: rw(273),
    marginRight: rw(30),
    paddingTop: rh(8),
    paddingBottom: rh(8),
    paddingLeft: rw(10),
    paddingRight: rw(10),
  },
  button_result: {
    borderWidth: 1,
    borderColor: Colors.black,
    backgroundColor: Colors.button,
    borderRadius: rw(15),
    justifyContent: 'center',
    marginTop: rh(86),
    marginBottom: rh(40),
    marginLeft: rw(267),
    marginRight: rw(30),
    paddingTop: rh(8),
    paddingBottom: rh(8),
    paddingLeft: rw(10),
    paddingRight: rw(10),
  },
})