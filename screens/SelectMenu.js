import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BackHandler } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MinusCircle from '../assets/icons/MinusCircle';
import { resizeWidth as rw, resizeHeight as rh } from '../dimensions/Dimensions';

const PERSISTENCE_KEY = 'SCREEN_SELECTMENU';

const TEXT_HEADING_LIKES = '좋아하는 음식을 알려주세요.';
const TEXT_HEADING_DISLIKES = '피하고 싶은 음식을 알려주세요.';
const TEXT_BODY = '취향을 반영해 식당 메뉴를 나열해 드려요.\n중복 선택, 또는 선택 없이 넘어가기가 가능해요.';

const TEXT_SELECT_ANOTHER = '다른 음식 고르기';

const DEFAULT_MENUS = {
  0: { // meat
    0: '돼지고기 전체',
    1: '소고기 전체',
    2: '닭고기 전체',
    3: '치킨',
    4: '돈가스',
    5: '찜닭',
    6: '삼겹살',
    7: '갈비',
    8: '제육',
    9: '탕수육',
  },
  1: { // fish
    0: '연어',
    1: '가자미',
    2: '어묵',
    3: '참치',
    4: '고등어',
    5: '임연수',
    6: '쥐어채',
  },
  2: { // veget
    0: '채소 전체',
    1: '김치',
    2: '샐러드',
    3: '대파',
    4: '콩나물',
    5: '감자',
    6: '고추',
    7: '토마토',
  },
  3: { // dairy
    0: '계란',
    1: '치즈',
    2: '마요네즈',
  },
  4: { // others
    0: '라면',
    1: '튀김',
    2: '떡볶이',
    3: '파스타',
    4: '순두부',
    5: '카레',
    6: '된장',
    7: '미역',
    8: '유부',
  },
};

const SelectMenu = () => {

  const route = useRoute();
  const navigation = useNavigation();

  const mode = route.params.mode;
  const category = route.params.category;

  const [menuButtons, setMenuButtons] = useState([]);
  const [likesTable, setLikesTable] = useState([]);
  const [dislikesTable, setDislikesTable] = useState([]);

  // load saved selections
  useEffect(()=>{
    const restoreState = async () => {
      try {
        const savedLikestable= await AsyncStorage.getItem(PERSISTENCE_KEY+'_LIKESTABLE');
        const savedDislikestable= await AsyncStorage.getItem(PERSISTENCE_KEY+'_DISLIKESTABLE');

        const loadedDislikes = savedDislikestable ? JSON.parse(savedDislikestable) : [];
        const loadedLikes = savedLikestable ? JSON.parse(savedLikestable) : [];

        setLikesTable(loadedLikes);
        setDislikesTable(loadedDislikes);
      } catch (e) {
        console.warn(e);
      }
    };
    restoreState();
  }, []);

  // save tables when back key pressed
  const handleBack = () => {
    saveTables();
    return false;
  }

  useEffect(()=>{
    BackHandler.addEventListener('hardwareBackPress', handleBack)
    return ()=>BackHandler.removeEventListener('hardwareBackPress', handleBack)
  }, [handleBack])

  const isInLikesTable = (name) => {
    return (likesTable.indexOf(name) > -1);
  }

  const pushLikes = (name) => {
    setLikesTable([...likesTable, name]);
  }

  const removeLikes = (name) => {
    setLikesTable(table => {
      return table.filter(item => item !== name)
    })
  }

  const isInDislikesTable = (name) => {
    return (dislikesTable.indexOf(name) > -1);
  }

  const pushDislikes = (name) => {
    setDislikesTable([...dislikesTable, name]);
  }

  const removeDislikes = (name) => {
    setDislikesTable(table => {
      return table.filter(item => item !== name)
    })
  }

  const disabledMenus = mode ? dislikesTable : likesTable;

  const isInDisabledMenus = (name) => {
    return (disabledMenus.indexOf(name) > -1);
  }

  const currentDefaultMenus = DEFAULT_MENUS[category];
  const isInTable = mode ? isInLikesTable : isInDislikesTable;
  const push = mode ? pushLikes : pushDislikes;
  const remove = mode ? removeLikes : removeDislikes;

  useEffect(()=>{
    const buttons = [];
    for (const key in currentDefaultMenus) {
      let name = currentDefaultMenus[key];
      let enabled = !isInDisabledMenus(name);
      buttons.push(
        <Pressable 
          key={key} 
          style={({ pressed }) => [ enabled && pressed ? { opacity: 0.8 } : {},
            (enabled && isInTable(name)) ? styles.button_menu_selected : styles.button_menu]}
          onPress={()=>{enabled && isInTable(name) ? remove(name) : push(name)}} >
          <Text style={[{opacity: (enabled ? 1.0 : 0.3)}, styles.text_button]}>{name}</Text>
          {enabled && isInTable(name) && <MinusCircle style={styles.minus_icon} />}
        </Pressable>
      );
    }
    setMenuButtons(buttons);
  }, [likesTable, dislikesTable])

  const saveTables = () => {
    AsyncStorage.setItem(PERSISTENCE_KEY+'_LIKESTABLE', JSON.stringify(likesTable));
    AsyncStorage.setItem(PERSISTENCE_KEY+'_DISLIKESTABLE', JSON.stringify(dislikesTable));
  }

  const navigateBack = () => {
    saveTables();
    navigation.navigate('SelectPreference')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text_heading}>{mode ? TEXT_HEADING_LIKES : TEXT_HEADING_DISLIKES}</Text>
      <Text style={styles.text_body}>{TEXT_BODY}</Text> 
      <View style={styles.container_menu_buttons}>{menuButtons}</View>
      <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_select_other]}
          onPress={()=>navigateBack()}>
            <Text style={styles.text_button}>{TEXT_SELECT_ANOTHER}</Text>
        </Pressable>
    </View>
  );

}

export default SelectMenu;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  container_menu_buttons: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    width: rw(385),
    height: rh(489),
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    marginTop: rh(41),
    paddingLeft: rw(10),
    paddingRight: rw(10),
    gap: rh(17),
  },
  text_heading: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: rw(28),
    textAlign: 'center',
    marginTop: rh(145),
  },
  text_body: {
    fontFamily: 'Pretendard-Regular',
    fontSize: rw(17),
    color: '#6B6B6B',
    textAlign: 'left',
    alignSelf: 'center',
    marginTop: rh(20),
  },
  text_button: {
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
    alignSelf:'center',
    fontSize: rw(20),
  },
  button_menu: {
    backgroundColor: '#D9D9D9',
    borderRadius: rw(10),
    width: 'fit-content',
    height: rh(38),
    justifyContent: 'center',
    paddingLeft: rw(15),
    paddingRight: rw(15),
  },
  button_menu_selected: {
    backgroundColor: '#FFBFBF',
    borderRadius: rw(10),
    width: 'fit-content',
    height: rh(38),
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: rw(15),
    paddingRight: rw(10),
  },
  button_select_other: {
    backgroundColor: '#FFBFBF',
    borderRadius: rw(10),
    justifyContent: 'center',
    marginTop: rh(86),
    marginBottom: rh(40),
    marginLeft: rw(218),
    marginRight: rw(30),
    paddingTop: rh(8),
    paddingBottom: rh(8),
    paddingLeft: rw(10),
    paddingRight: rw(10),
  },
  minus_icon: {
    marginLeft: rw(5), 
    size: rw(20), 
    alignSelf: 'center',
  },
})