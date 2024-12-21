import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomeText from '../global/CustomeText';
import {commonStyles} from '../../styles/commonStyles';

const Misc = () => {
  return (
    <View style={styles.containr}>
      <CustomeText fontSize={13} fontfamily="Okra-Bold">
        Explore
      </CustomeText>
      <Image
        source={require('../../assets/icons/wild_robot.jpg')}
        style={styles.addBanner}
      />
      <View style={commonStyles.flexRowBetween}>
        <CustomeText style={styles.text} fontfamily="Okra-Bold" fontSize={22}>
          #1 World best File Sharing App!
        </CustomeText>
        <Image
          source={require('../../assets/icons/share_logo.jpg')}
          style={styles.image}
        />
      </View>
      <CustomeText fontfamily="Okra-Light" style={styles.text2}>
        Made with - Afzal Ahmad
      </CustomeText>
    </View>
  );
};

export default Misc;

const styles = StyleSheet.create({
  containr: {
    paddingVertical: 20,
  },
  addBanner: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginVertical: 25,
  },
  text: {
    opacity: 0.5,
    width: '60%',
  },
  text2: {
    opacity: 0.5,
    marginTop: 10,
  },
  image: {
    resizeMode: 'contain',
    height: 120,
    width: '35%',
  },
});
