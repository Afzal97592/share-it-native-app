import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {FC, useEffect} from 'react';
import {navigate} from '../utils/NavigationUtil';
import {commonStyles} from '../styles/commonStyles';

const SplashScreen: FC = () => {
  const navigateToHome = () => {
    navigate('HomeScreen');
  };

  useEffect(() => {
    const timeOutId = setTimeout(navigateToHome, 1200);
    return () => clearTimeout(timeOutId);
  }, []);

  return (
    <SafeAreaView style={commonStyles.container}>
      <Image
        source={require('../assets/images/logo_text.png')}
        style={commonStyles.img}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
