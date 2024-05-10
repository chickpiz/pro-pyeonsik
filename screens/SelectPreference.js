import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BackHandler } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { resizeWidth as rw, resizeHeight as rh } from '../dimensions/Dimensions';

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

const CATEGORY_MEAT = 0;
const CATEGORY_FISH = 1;
const CATEGORY_VEGET = 2;
const CATEGORY_DAIRY = 3;
const CATEGORY_OTHERS = 4;

const SelectPreference = () => {

  const route = useRoute();
  const navigation = useNavigation();

  /**
   * mode == true: select likes
   * mode == false: select dislikes
   */
  //const mode = route.params.mode;
  const [mode, setMode] = useState(true);

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

  return (
    <View style={styles.container}>
      {/* select likes */}
      {mode && <Text style={styles.text_heading}>{TEXT_HEADING_LIKES}</Text>}
      {/* select dislikes */}
      {!(mode) && <Text style={styles.text_heading}>{TEXT_HEADING_DISLIKES}</Text>}
      <Text style={styles.text_body}>{TEXT_BODY}</Text> 
      <View style={styles.container_category_buttons}>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_category]} 
          onPress={()=>navigateTo(CATEGORY_MEAT)}>
          <Text style={styles.text_button}>{TEXT_MEAT}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_category]} 
          onPress={()=>navigateTo(CATEGORY_FISH)}>
          <Text style={styles.text_button}>{TEXT_FISH}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_category]} 
          onPress={()=>navigateTo(CATEGORY_VEGET)}>
          <Text style={styles.text_button}>{TEXT_VEGET}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_category]} 
          onPress={()=>navigateTo(CATEGORY_DAIRY)}>
          <Text style={styles.text_button}>{TEXT_DAIRY}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_category]} 
          onPress={()=>navigateTo(CATEGORY_OTHERS)}>
          <Text style={styles.text_button}>{TEXT_OTHERS}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_category]} 
          onPress={()=>navigateTo(-1)}>
          <Text style={styles.text_button}>{TEXT_CUSTOM}</Text>
        </Pressable>
      </View>
      {mode && <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_next]}
        onPress={()=>setMode(false)}>
          <Text style={styles.text_button}>{TEXT_NEXT}</Text>
      </Pressable>}
      {!(mode) && <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_next]}
        onPress={()=>{navigation.navigate('HomeScreen'); navigation.reset({routes: [{name: 'HomeScreen'}]});}}>
          <Text style={styles.text_button}>{TEXT_NEXT}</Text>
      </Pressable>}
    </View>
  )
}

export default SelectPreference;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  container_category_buttons: {
    alignContent: 'center',
    width: rw(333),
    height: rh(489),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: rh(41),
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
  button_category: {
    backgroundColor: '#FFBFBF',
    borderRadius: 10,
    width: rw(333),
    height: rh(67),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button_next: {
    backgroundColor: '#FFBFBF',
    borderRadius: rw(10),
    justifyContent: 'center',
    marginTop: rh(86),
    marginBottom: rh(40),
    marginLeft: rw(315),
    marginRight: rw(30),
    paddingTop: rh(8),
    paddingBottom: rh(8),
    paddingLeft: rw(10),
    paddingRight: rw(10),
  },
})