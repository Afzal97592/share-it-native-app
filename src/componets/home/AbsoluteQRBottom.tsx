import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {bottomTabStyles} from '../../styles/bottomTabStyle';
import Icon from '../global/Icon';
import {navigate} from '../../utils/NavigationUtil';

const AbsoluteQRBottom = () => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View style={bottomTabStyles.container}>
      <TouchableOpacity onPress={() => navigate('RecivedFileScreen')}>
        <Icon name="apps-sharp" iconFamily="Ionicons" color="#333" size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={bottomTabStyles.qrCode}
        onPress={() => setIsVisible(true)}>
        <Icon
          name="qrcode-scan"
          iconFamily="MaterialCommunityIcons"
          color="#333"
          size={24}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate('RecivedFileScreen')}>
        <Icon name="beer-sharp" iconFamily="Ionicons" color="#333" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default AbsoluteQRBottom;

const styles = StyleSheet.create({});
