import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {commonStyles} from '../styles/commonStyles';
import HomeHeader from '../componets/home/HomeHeader';
import SendReciveButton from '../componets/home/SendReciveButton';
import Options from '../componets/home/Options';
import Misc from '../componets/home/Misc';
import AbsoluteQRBottom from '../componets/home/AbsoluteQRBottom';

const HomeScreen: FC = () => {
  return (
    <View style={commonStyles.baseContainer}>
      <HomeHeader />
      <ScrollView contentContainerStyle={{paddingBottom: 100, padding: 15}}>
        <SendReciveButton />
        <Options />
        <Misc />
      </ScrollView>
      <AbsoluteQRBottom />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
