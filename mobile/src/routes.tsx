import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Detail';

const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      {/* @ts-ignore */}
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Points' component={Points} />
        <Stack.Screen name='Detail' component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
