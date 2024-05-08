import { useState, useContext } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { resizeWidth as rw, resizeHeight as rh } from '../dimensions/Dimensions';
import { MenuContext } from '../contexts/MenuContext';

const TEXT_HEADING_LIKES = '좋아하는 음식을 알려주세요.';
const TEXT_HEADING_DISLIKES = '피하고 싶은 음식을 알려주세요.';
const TEXT_BODY = '취향을 반영해 식당 메뉴를 나열해 드려요.\n중복 선택, 또는 선택 없이 넘어가기가 가능해요.';

const MODE_SELECT_LIKES = 'LIKES';

const CATEGORY_NONE = 'NONE';
const CATEGORY_MEAT = 'MEAT';
const CATEGORY_FISH = 'FISH';
const CATEGORY_VEGET = 'VEGET';
const CATEGORY_DAIRY = 'DAIRY';
const CATEGORY_OTHERS = 'OTHERS';
const CATEGORY_CUSTOM = 'CUSTOM';

const PAGE_CATEGORY_LIKES = 1;
const PAGE_MEAT = 2;
const PAGE_FISH = 3;
const PAGE_VEGET = 4;
const PAGE_DAIRY = 5;
const PAGE_OTHERS = 6;
const PAGE_CUSTOM = 7;

const SelectPreference = ({navigation}, selectMode) => {

  const [page, setPage] = useState(PAGE_CATEGORY_LIKES);
  const [menuName, setMenuName] = useState(CATEGORY_NONE);
  const [menuCategory, setMenuCategory] = useState('');
  const [menuLike, setMenuLike] = useState(true);
  const { menu, dispatch: dispatchMenu } = useContext(MenuContext);

  const setCategoryAndPage = (_category, _page) => {
    setMenuCategory(_category);
    setPage(_page);
  }

  const saveMenu = async () => {
    if (menuName == '') {
        return;
    }
    dispatchMenu({type: 'push', value: 
    {
        name: menuName,
        category: menuCategory,
        like: menuLike,
        dislike: false,
    }});
  }



  return (
    <View style={styles.container}>
      <Text style={styles.text_heading}>{TEXT_HEADING_LIKES}</Text>
      <Text style={styles.text_body}>{TEXT_BODY}</Text> 
      {page == PAGE_CATEGORY_LIKES && 
      <View style={styles.container_category_buttons}>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_category]} 
          onPress={()=>setCategoryAndPage(CATEGORY_MEAT, PAGE_MEAT)}>
          <Text style={styles.text_button}>고기</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_category]} 
          onPress={()=>setCategoryAndPage(CATEGORY_FISH, PAGE_FISH)}>
          <Text style={styles.text_button}>생선</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_category]} 
          onPress={()=>setCategoryAndPage(CATEGORY_VEGET, PAGE_VEGET)}>
          <Text style={styles.text_button}>채소</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_category]} 
          onPress={()=>setCategoryAndPage(CATEGORY_DAIRY, PAGE_DAIRY)}>
          <Text style={styles.text_button}>계란 및 유제품</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_category]} 
          onPress={()=>setCategoryAndPage(CATEGORY_OTHERS, PAGE_OTHERS)}>
          <Text style={styles.text_button}>기타</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_category]} 
          onPress={()=>setCategoryAndPage(CATEGORY_CUSTOM, PAGE_CUSTOM)}>
          <Text style={styles.text_button}>+직접 입력</Text>
        </Pressable>
      </View>}
      {page == PAGE_MEAT && <View style={styles.container_menu_buttons}>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          >
          <Text style={styles.text_button}>돼지고기 전체</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          >
          <Text style={styles.text_button}>소고기 전체</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          >
          <Text style={styles.text_button}>닭고기 전체</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          >
          <Text style={styles.text_button}>치킨</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          >
          <Text style={styles.text_button}>돈가스</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          >
          <Text style={styles.text_button}>찜닭</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          >
          <Text style={styles.text_button}>삼겹살</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          >
          <Text style={styles.text_button}>갈비</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          >
          <Text style={styles.text_button}>제육</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          >
          <Text style={styles.text_button}>탕수육</Text>
        </Pressable>
      </View>}
      {page == PAGE_FISH && <View style={styles.container_menu_buttons}>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          onPress={()=>setPage(PAGE_CATEGORY_LIKES)}>
          <Text style={styles.text_button}>fishfish</Text>
        </Pressable>
      </View>}
      {page == PAGE_VEGET && <View style={styles.container_menu_buttons}>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          onPress={()=>setPage(PAGE_CATEGORY_LIKES)}>
          <Text style={styles.text_button}>veget</Text>
        </Pressable>
      </View>}
      {page == PAGE_DAIRY && <View style={styles.container_menu_buttons}>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          onPress={()=>setPage(PAGE_CATEGORY_LIKES)}>
          <Text style={styles.text_button}>dairy</Text>
        </Pressable>
      </View>}
      {page == PAGE_OTHERS && <View style={styles.container_menu_buttons}>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          onPress={()=>setPage(PAGE_CATEGORY_LIKES)}>
          <Text style={styles.text_button}>others</Text>
        </Pressable>
      </View>}
      {page == PAGE_CUSTOM && <View style={styles.container_menu_buttons}>
        <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_menu]} 
          onPress={()=>setPage(PAGE_CATEGORY_LIKES)}>
          <Text style={styles.text_button}>custom</Text>
        </Pressable>
      </View>}
      {page == PAGE_CATEGORY_LIKES && <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_next]}
        >
          <Text style={styles.text_button}>다음</Text>
      </Pressable>}
      {page == PAGE_MEAT && <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_select_other]}
        onPress={()=>setCategoryAndPage(CATEGORY_NONE, PAGE_CATEGORY_LIKES)}>
          <Text style={styles.text_button}>다른 음식 고르기</Text>
      </Pressable>}
      {page == PAGE_FISH  && <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_select_other]}
        onPress={()=>setCategoryAndPage(CATEGORY_NONE, PAGE_CATEGORY_LIKES)}>
          <Text style={styles.text_button}>다른 음식 고르기</Text>
      </Pressable>}
      {page == PAGE_VEGET  && <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_select_other]}
        onPress={()=>setCategoryAndPage(CATEGORY_NONE, PAGE_CATEGORY_LIKES)}>
          <Text style={styles.text_button}>다른 음식 고르기</Text>
      </Pressable>}
      {page == PAGE_DAIRY  && <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_select_other]}
        onPress={()=>setCategoryAndPage(CATEGORY_NONE, PAGE_CATEGORY_LIKES)}>
          <Text style={styles.text_button}>다른 음식 고르기</Text>
      </Pressable>}
      {page == PAGE_OTHERS  && <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_select_other]}
        onPress={()=>setCategoryAndPage(CATEGORY_NONE, PAGE_CATEGORY_LIKES)}>
          <Text style={styles.text_button}>다른 음식 고르기</Text>
      </Pressable>}
      {page == PAGE_CUSTOM  && <Pressable style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}, styles.button_select_other]}
        onPress={()=>setCategoryAndPage(CATEGORY_NONE, PAGE_CATEGORY_LIKES)}>
          <Text style={styles.text_button}>다른 음식 고르기</Text>
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
  button_menu: {
    backgroundColor: '#D9D9D9',
    borderRadius: rw(10),
    width: 'fit-content',
    height: rh(38),
    justifyContent: 'center',
    paddingLeft: rw(15),
    paddingRight: rw(15),
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
})