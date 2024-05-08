import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import useColorScheme from '../hooks/UseColorScheme';
import SelectPreference from '../screens/SelectPreference';

const MODE_SELECT_LIKES = 'LIKES';

function Navigation() {
  const colorScheme = useColorScheme();
  return (
    <NavigationContainer 
    theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator/>
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();

function RootNavigator() {
  return (
    //TODO: set initialRouteName (selectPreference on initial run, otherwise Home)
    <Stack.Navigator initialRouteName="SelectPreference">
      <Stack.Screen 
        name="SelectPreference" 
        options={{ headerShown: false }} 
        component={SelectPreference}
        initialParams={{ selectMode: MODE_SELECT_LIKES }}
      />
    </Stack.Navigator>
  );
}

export default Navigation;