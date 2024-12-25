import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import {navigationRef} from '../utils/NavigationUtil';
import HomeScreen from '../screens/HomeScreen';
import {TCPProvider} from '../services/TCPProvider';
import ConnectionScreen from '../screens/ConnectionScreen';
import SendScreen from '../screens/SendScreen';
import ReceivedScreen from '../screens/ReceivedScreen';
import ReceivedFileScreen from '../screens/ReceivedFileScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <TCPProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="ConnectionScreen" component={ConnectionScreen} />
          <Stack.Screen name="SendScreen" component={SendScreen} />
          <Stack.Screen name="ReceivedScreen" component={ReceivedScreen} />
          <Stack.Screen
            name="ReceivedFileScreen"
            component={ReceivedFileScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TCPProvider>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
