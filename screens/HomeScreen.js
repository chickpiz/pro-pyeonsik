import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { resizeWidth as rw, resizeHeight as rh } from '../dimensions/Dimensions';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, height: '100%', justifyContent: 'center', backgroundColor: '#FFFFFF'}}>
        <Text style={{fontFamily: 'Pretendard-Regular', fontSize: rw(24), alignSelf: 'center'}}>당신의 취향을 반영 중...</Text>
    </View>
  )
}

export default HomeScreen;