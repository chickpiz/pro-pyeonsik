import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';

import SelectPreference from '../screens/SelectPreference';
import SelectMenu from '../screens/SelectMenu';
import AddCustomMenu from '../screens/AddCustomMenu';
import HomeScreen from '../screens/HomeScreen';

function Navigation({initFinished, colorScheme}) {
  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator initFinished={initFinished}/>
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();

function RootNavigator({initFinished}) {
  const initialRoute = initFinished ? 'HomeScreen' : 'SelectPreference';
  return (
    <Stack.Navigator 
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name='SelectPreference' 
        component={SelectPreference}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen 
        name='SelectMenu' 
        component={SelectMenu}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen 
        name='AddCustomMenu' 
        component={AddCustomMenu}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen 
        name='HomeScreen' 
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
}

export default Navigation;