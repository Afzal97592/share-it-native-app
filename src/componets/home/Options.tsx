import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {optionStyles} from '../../styles/optionsStyles';
import Icon from '../global/Icon';
import {Colors} from '../../utils/Constants';
import CustomeText from '../global/CustomeText';
import {useTCP} from '../../services/TCPProvider';
import {navigate} from '../../utils/NavigationUtil';
import {pickDocument, pickImage} from '../../utils/libraryHelpers';

const Options: FC<{
  isHome?: boolean;
  onMediaPickedUp?: (media: any) => void;
  onFilePickedUp?: (file: any) => void;
}> = ({isHome, onFilePickedUp, onMediaPickedUp}) => {
  const {isConnected} = useTCP();

  const handleUniversalPicker = async (type: string) => {
    if (isHome) {
      if (isConnected) {
        navigate('ConnectionScreen');
      } else {
        navigate('SendScreen');
      }
      return;
    }
    if (type === 'images' && onMediaPickedUp) {
      pickImage(onMediaPickedUp);
    }
    if (type === 'files' && onFilePickedUp) {
      pickDocument(onFilePickedUp);
    }
  };
  return (
    <View style={optionStyles.container}>
      <TouchableOpacity
        onPress={() => handleUniversalPicker('images')}
        style={optionStyles.subContainer}>
        <Icon
          name="images"
          iconFamily="Ionicons"
          color={Colors.primary}
          size={20}
        />
        <CustomeText
          fontfamily="Okra-Medium"
          style={{marginTop: 4, textAlign: 'center'}}>
          Photo
        </CustomeText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleUniversalPicker('images')}
        style={optionStyles.subContainer}>
        <Icon
          name="musical-notes-sharp"
          iconFamily="Ionicons"
          color={Colors.primary}
          size={20}
        />
        <CustomeText
          fontfamily="Okra-Medium"
          style={{marginTop: 4, textAlign: 'center'}}>
          Audio
        </CustomeText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleUniversalPicker('images')}
        style={optionStyles.subContainer}>
        <Icon
          name="folder-open"
          iconFamily="Ionicons"
          color={Colors.primary}
          size={20}
        />
        <CustomeText
          fontfamily="Okra-Medium"
          style={{marginTop: 4, textAlign: 'center'}}>
          Files
        </CustomeText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleUniversalPicker('images')}
        style={optionStyles.subContainer}>
        <Icon
          name="contacts"
          iconFamily="MaterialCommunityIcons"
          color={Colors.primary}
          size={20}
        />
        <CustomeText
          fontfamily="Okra-Medium"
          style={{marginTop: 4, textAlign: 'center'}}>
          Contacts
        </CustomeText>
      </TouchableOpacity>
    </View>
  );
};

export default Options;

const styles = StyleSheet.create({});
