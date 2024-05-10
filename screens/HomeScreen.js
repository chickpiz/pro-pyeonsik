import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, height: '100%', justifyContent: 'center'}}>
        <Text style={{alignSelf: 'center'}}>This is homescreen</Text>
    </View>
  )
}

export default HomeScreen;