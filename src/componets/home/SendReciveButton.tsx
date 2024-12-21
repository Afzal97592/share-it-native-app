import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {screenHeight} from '../../utils/Constants';

const SendReciveButton = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Image
          source={require('../../assets/icons/send1.jpg')}
          style={styles.img}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Image
          source={require('../../assets/icons/receive1.jpg')}
          style={styles.img}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SendReciveButton;

const styles = StyleSheet.create({
  container: {
    marginTop: screenHeight * 0.06,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  button: {
    width: 140,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
