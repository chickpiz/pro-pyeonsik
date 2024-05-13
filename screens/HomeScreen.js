import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { resizeWidth as rw, resizeHeight as rh } from '../dimensions/Dimensions';
import { Colors } from '../assets/colors/Colors';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, height: '100%', justifyContent: 'center', backgroundColor: '#FFFFFF'}}>
        <Text style={{fontFamily: 'BodyFont-medium', fontSize: rw(20), alignSelf: 'center'}}>당신의 취향을 반영 중...</Text>
    </View>
  )
}

export default HomeScreen;