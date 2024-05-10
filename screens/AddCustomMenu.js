import { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Text, Pressable, StyleSheet, TextInput, ScrollView, RefreshControl } from 'react-native';
import { Platform, BackHandler } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WithLocalSvg } from 'react-native-svg/css';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ICON_MINUS } from '../assets/Index';
import { resizeWidth as rw, resizeHeight as rh } from '../dimensions/Dimensions';
import { useKeyboard } from '../hooks/Keyboard';

const PERSISTENCE_KEY = 'SCREEN_ADDCUSTOMMENU';

const TEXT_HEADING_LIKES = '좋아하는 음식을 알려주세요.';
const TEXT_HEADING_DISLIKES = '피하고 싶은 음식을 알려주세요.';
const TEXT_PLEASE_INPUT = '키워드를 입력해주세요.';

const TEXT_REGISTER = '등록';
const TEXT_BACK = '뒤로 가기';
const TEXT_COMPLETE = '입력 완료';

const AddCustomMenu = () => {

  const route = useRoute();
  const navigation = useNavigation();

  const mode = route.params.mode;

  const keyboardHeight = useKeyboard();
  const [inputText, setInputText] = useState('');
  const [buttonEnable, setButtonEnable] = useState(false);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [menuButtons, setMenuButtons] = useState([]);

  // load saved selections
  useEffect(()=>{
    const restoreState = async () => {
      try {
        const savedLikes= await AsyncStorage.getItem(PERSISTENCE_KEY+'_LIKES');
        const savedDislikes= await AsyncStorage.getItem(PERSISTENCE_KEY+'_DISLIKES');

        const loadedDislikes = savedDislikes ? JSON.parse(savedDislikes) : [];
        const loadedLikes = savedLikes ? JSON.parse(savedLikes) : [];

        setLikes(loadedLikes);
        setDislikes(loadedDislikes);
      } catch (e) {
        console.warn(e);
      }
    };
    restoreState();
  }, []);

  // save tables when back key pressed
  useEffect(()=>{
    BackHandler.addEventListener('hardwareBackPress', saveTables)
    return ()=>BackHandler.removeEventListener('hardwareBackPress', saveTables)
  }, [saveTables])

  useEffect(() => {
    if (inputText === '') setButtonEnable(false); 
    else setButtonEnable(true);
  }, [inputText]);

  const menus = mode ? likes : dislikes;
  const setMenus = mode ? setLikes : setDislikes;
  const disabledMenus = mode ? dislikes : likes;

  useEffect(() => {
    const updateMenuButtons = []
    for (const key in menus) {
      updateMenuButtons.push(
        <Pressable 
          key={menus[key]}
          style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]}
          onPress={()=>{removeMenu(menus[key])}} >
          <Text style={styles.text_button}>{menus[key]}</Text>
          <WithLocalSvg style={{marginLeft: rw(5), alignSelf: 'center'}} asset={ICON_MINUS}/>
        </Pressable>
      );
    }
    setMenuButtons(updateMenuButtons);
  }, [menus]);

  const addNewMenu = (name) => {
    if (isInMenus(name)) return; // duplicated menu
    if (isInDisabledMenus(name)) return; // menu is in opposite preference
    setInputText('');
    pushMenu(name);
  }
  
  const isInMenus = (name) => {
    return (menus.indexOf(name) > -1);
  }

  const pushMenu = (name) => {
    setMenus([...menus, name]);
  }

  const removeMenu = (name) => {
    setMenus(table => {
      return table.filter(item => item !== name)
    })
  }

  const isInDisabledMenus = (name) => {
    return (disabledMenus.indexOf(name) > -1);
  }

  const saveTables = () => {
    AsyncStorage.setItem(PERSISTENCE_KEY+'_LIKES', JSON.stringify(likes));
    AsyncStorage.setItem(PERSISTENCE_KEY+'_DISLIKES', JSON.stringify(dislikes));
  }

  const navigateBack = () => {
    saveTables();
    navigation.navigate('SelectPreference')
  }

  return (
    <View style={styles.container}>
      {/* select likes */}
      {mode && <Text style={styles.text_heading}>{TEXT_HEADING_LIKES}</Text>}
      {/* select dislikes */}
      {!(mode) && <Text style={styles.text_heading}>{TEXT_HEADING_DISLIKES}</Text>}
      <View style={styles.container_input}>
        <TextInput
          style={[{opacity: (buttonEnable ? 1.0 : 0.3)}, styles.text_input]}
          onChangeText={setInputText}
          value={inputText}
          placeholder={TEXT_PLEASE_INPUT}
          placeholderTextColor='#000000'
        />
        <View style={{width: 1, height: '100%', backgroundColor: '#FFFFFF', marginLeft: rw(67.64)}}/>
        <Pressable 
          style={({ pressed }) => [ pressed && buttonEnable ? { opacity: 0.8 } : {}, 
          styles.button_register]}
          onPress={()=>{if(buttonEnable == true) addNewMenu(inputText);}}>
          <Text style={[styles.text_button, {opacity: (buttonEnable ? 1.0 : 0.3)}]}>{TEXT_REGISTER}</Text>
        </Pressable>
      </View>
      <KeyboardAvoidingView style={{flex: 1, marginBottom: (keyboardHeight ? rh(5) : rh(50))}}>
        <ScrollView overflow='scroll' scrollEnabled={true}>
          <View style={styles.container_menu_buttons}>{menuButtons}</View>
        </ScrollView>
        <View
          style={styles.container_control_buttons}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> 
          <Pressable 
            style={
              ({ pressed }) => [ pressed ? { opacity: 0.8 } : {},
              styles.button_back]}
            onPress={()=>navigateBack()}>
              <Text style={styles.text_button}>{TEXT_BACK}</Text>
          </Pressable>
          <Pressable 
            style={
              ({ pressed }) => [ pressed && buttonEnable ? { opacity: 0.8 } : {},
              {backgroundColor: (buttonEnable ? '#FFBFBF' : '#D9D9D9')},
              styles.button_complete]}
            onPress={()=>navigateBack()}>
              <Text style={
                [styles.text_button,
                {opacity: (buttonEnable ? 1.0 : 0.3)}]}>{TEXT_COMPLETE}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default AddCustomMenu;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  text_heading: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: rw(28),
    textAlign: 'center',
    marginTop: rh(145),
  },
  container_input: {
    borderRadius: rw(10),
    width: rw(330),
    height: rh(48),
    marginTop: rh(73),
    paddingLeft: rw(10),
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  container_menu_buttons: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    width: rw(385),
    height: '100%',
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    marginTop: rh(30),
    paddingLeft: rw(10),
    paddingRight: rw(10),
    gap: rh(17),
  },
  container_control_buttons: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  text_input: {
    alignSelf: 'center',
    fontFamily: 'Pretendard-Regular',
    textAlign: 'left',
    fontSize: rw(18),
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  text_button: {
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
    alignSelf:'center',
    fontSize: rw(20),
  },
  button_register: {
    width: rw(75), 
    height: '100%', 
    backgroundColor: '#D9D9D9', 
    justifyContent: 'center',
  },
  button_menu: {
    backgroundColor: '#FFBFBF',
    borderRadius: rw(10),
    width: 'fit-content',
    height: rh(38),
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: rw(15),
    paddingRight: rw(10),
  },
  button_back: {
    backgroundColor: '#FFBFBF',
    borderRadius: rw(10),
    justifyContent: 'center',
    alignSelf: 'bottom',
    marginLeft: rw(30),
    marginRight: rw(90),
    paddingTop: rh(8),
    paddingBottom: rh(8),
    paddingLeft: rw(10),
    paddingRight: rw(10),
  },
  button_complete: {
    //backgroundColor: '#FFBFBF',
    borderRadius: rw(10),
    justifyContent: 'center',
    alignSelf: 'bottom',
    marginLeft: rw(90),
    marginRight: rw(30),
    paddingTop: rh(8),
    paddingBottom: rh(8),
    paddingLeft: rw(10),
    paddingRight: rw(10),
  },
})