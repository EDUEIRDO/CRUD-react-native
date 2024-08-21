import React, { useState } from 'react';
import { StatusBar, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './index';
import Tela from './tela';

const Stack = createStackNavigator();

function Layout() {
//  const [home, setHome] = useState(true);

  StatusBar.setBarStyle('default');
/*  if (Platform.OS === 'android') StatusBar.setBackgroundColor('#fff');
  if (home) {
    StatusBar.setHidden(true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#fff');
      StatusBar.setBarStyle('light-content');
    }
  } else {
    StatusBar.setHidden(false);
  }
*/
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='index'
        component={Home}
      />
      <Stack.Screen
        name='tela'
        component={Tela}
      />
    </Stack.Navigator>
  
    
  );
}

export default Layout;
