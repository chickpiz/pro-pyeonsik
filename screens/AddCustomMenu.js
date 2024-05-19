import { useState, useEffect, useContext } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BackHandler } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SelectContext } from '../contexts/SelectContext';
import MinusCircle from '../assets/icons/MinusCircle';
import ChevronLeft from '../assets/icons/ChevronLeft';
import { resizeWidth as rw, resizeHeight as rh } from '../dimensions/Dimensions';
import { Colors } from '../assets/colors/Colors';

const PERSISTENCE_KEY_LIKES = 'CUSTOME_LIKES';
const PERSISTENCE_KEY_DISLIKES = 'CUSTOM_DISLIKES';

const TEXT_HEADING_LIKES = '좋아하는 음식을 알려주세요.';
const TEXT_HEADING_DISLIKES = '피하고 싶은 음식을 알려주세요.';
const TEXT_PLEASE_INPUT = '키워드를 입력해주세요.';

const TEXT_REGISTER = '등록';

const AddCustomMenu = () => {

  const route = useRoute();
  const navigation = useNavigation();

  const mode = route.params.mode;

  const [inputText, setInputText] = useState('');
  const [buttonEnable, setButtonEnable] = useState(false);
  const [likeMenus, setLikeMenus] = useState([]);
  const [dislikeMenus, setDislikeMenus] = useState([]);
  const [menuButtons, setMenuButtons] = useState([]);
  const {likes, dislikes, setLikes, setDislikes} = useContext(SelectContext);

  // load saved selections
  useEffect(()=>{
    const restoreState = async () => {
      try {
        const savedLikes= await AsyncStorage.getItem(PERSISTENCE_KEY_LIKES);
        const savedDislikes= await AsyncStorage.getItem(PERSISTENCE_KEY_DISLIKES);

        const loadedDislikes = savedDislikes ? JSON.parse(savedDislikes) : [];
        const loadedLikes = savedLikes ? JSON.parse(savedLikes) : [];

        setLikeMenus(loadedLikes);
        setDislikeMenus(loadedDislikes);
      } catch (e) {
        console.warn(e);
      }
    };
    restoreState();
  }, []);

  useEffect(() => {
    if (inputText === '') setButtonEnable(false); 
    else setButtonEnable(true);
  }, [inputText]);

  const menus = mode ? likeMenus : dislikeMenus;
  const setMenus = mode ? setLikeMenus : setDislikeMenus;
  const disabledMenus = mode ? dislikeMenus : likeMenus;

  useEffect(() => {
    const updateMenuButtons = []
    for (const key in menus) {
      updateMenuButtons.push(
        <Pressable 
          key={menus[key]}
          style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]}
          onPress={()=>{removeMenu(menus[key])}} >
          <Text style={styles.text_button}>{menus[key]}</Text>
          <MinusCircle style={styles.minus_icon} />
        </Pressable>
      );
    }
    setMenuButtons(updateMenuButtons);

    let _newlikes = mode ? likes : dislikes;
    _newlikes[5] = (menus.length > 0);
    const setNewLikes = mode ? setLikes : setDislikes;
    setNewLikes(_newlikes);
  }, [likeMenus, dislikeMenus]);

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
    AsyncStorage.setItem(PERSISTENCE_KEY_LIKES, JSON.stringify(likeMenus));
    AsyncStorage.setItem(PERSISTENCE_KEY_DISLIKES, JSON.stringify(dislikeMenus));
  }

  // save tables when back key pressed
  const handleBack = () => {
    saveTables();
    return false;
  }

  useEffect(()=>{
    BackHandler.addEventListener('hardwareBackPress', handleBack)
    return ()=>BackHandler.removeEventListener('hardwareBackPress', handleBack)
  }, [handleBack])

  const navigateBack = () => {
    saveTables();
    navigation.navigate('SelectPreference')
  }

  return (
    <View style={styles.container}>
      <Pressable 
        style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_back_top]}
        onPress={()=>navigateBack()}>
        <ChevronLeft style={styles.chevron_left_icon} />
      </Pressable>
      <Text style={styles.text_heading}>{mode ? TEXT_HEADING_LIKES : TEXT_HEADING_DISLIKES}</Text>
      <View style={styles.container_input}>
        <TextInput
          style={[{opacity: (buttonEnable ? 1.0 : 0.3)}, styles.text_input]}
          onChangeText={setInputText}
          value={inputText}
          placeholder={TEXT_PLEASE_INPUT}
          placeholderTextColor='#000000'
          selectionColor={Colors.button}
          selectionHandleColor={Colors.emphasize}
          cursorColor={Colors.emphasize}
          autoFocus={likes[5] ? false : true}
        />
        <View style={{width: 1, height: '100%', backgroundColor: Colors.black, marginLeft: rw(21)}}/>
        <Pressable 
          style={({ pressed }) => [ pressed && buttonEnable ? { opacity: 0.8 } : {}, 
          styles.button_register]}
          onPress={()=>{if(buttonEnable == true) addNewMenu(inputText);}}>
          <Text style={[styles.text_button, {opacity: (buttonEnable ? 1.0 : 0.3)}]}>{TEXT_REGISTER}</Text>
        </Pressable>
      </View>
      <KeyboardAwareScrollView style={{height: 'fit-content', maxHeight: rh(580), marginTop: rh(30), marginBottom: rh(10)}} overflow='scroll' scrollEnabled={true}>
        <View style={styles.container_menu_buttons}>{menuButtons}</View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default AddCustomMenu;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backGround,
  },
  text_heading: {
    fontFamily: 'HeadingFont',
    fontSize: rw(25),
    textAlign: 'center',
    marginTop: rh(145),
  },
  container_input: {
    borderRadius: rw(15),
    width: rw(330),
    height: rh(48),
    marginTop: rh(73),
    paddingLeft: rw(10),
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'center',
    backgroundColor: Colors.backGround,
    alignSelf: 'center',
    overflow: 'hidden',
    borderColor: '#000000',
    borderWidth: 1,
  },
  container_menu_buttons: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    width: rw(385),
    height: '100%',
    backgroundColor: Colors.backGround,
    alignSelf: 'center',
    paddingLeft: rw(10),
    paddingRight: rw(10),
    gap: rh(17),
  },
  container_control_buttons: {
    backgroundColor: Colors.backGround,
    flexDirection: 'row',
  },
  text_input: {
    alignSelf: 'center',
    fontFamily: 'BodyFont-medium',
    textAlign: 'left',
    width: rw(222),
    fontSize: rw(20),
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  text_button: {
    fontFamily: 'ButtonFont',
    textAlign: 'center',
    alignSelf:'center',
    fontSize: rw(20),
  },
  button_register: {
    width: rw(69), 
    height: '100%', 
    backgroundColor: Colors.backGround, 
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button_menu: {
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: Colors.button,
    borderRadius: rw(15),
    width: 'fit-content',
    height: rh(38),
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: rw(15),
    paddingRight: rw(10),
  },
  button_back_top: {
    backgroundColor: Colors.backGround,
    position: 'absolute',
    width: rw(35),
    height: rh(35),
    left: rw(9),
    top: rh(75),
  },
  minus_icon: {
    marginLeft: rw(10),
    size: rw(24),
    alignSelf: 'center',
  },
  chevron_left_icon: {
    width: rw(14.44),
    height: rh(24.75),
    alignSelf: 'center',
  },
})