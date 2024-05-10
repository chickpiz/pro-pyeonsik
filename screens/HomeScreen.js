import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, height: '100%', justifyContent: 'center'}}>
        <Text style={{alignSelf: 'center'}}>당신의 취향을 반영 중...</Text>
    </View>
  )
}

export default HomeScreen;