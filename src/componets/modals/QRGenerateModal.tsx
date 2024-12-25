import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {modalStyles} from '../../styles/modalStyles';
import Icon from '../global/Icon';
import CustomeText from '../global/CustomeText';
import {Camera, CodeScanner, useCameraDevice} from 'react-native-vision-camera';
import {LinearGradient} from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Image} from 'react-native';
import {multiColor} from '../../utils/Constants';
import DeviceInfo from 'react-native-device-info';
import {useTCP} from '../../services/TCPProvider';
import {navigate} from '../../utils/NavigationUtil';
import {getLocalIPAddress} from '../../utils/networkUtils';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

const QRGenerateModal: FC<ModalProps> = ({visible, onClose}) => {
  const {isConnected, startServer, server} = useTCP();
  const [loading, setIsLoading] = useState(true);
  const [qrValue, setQrValue] = useState('Afzal');
  const shimmarTranslateX = useSharedValue(-300);

  const shimmarStyle = useAnimatedStyle(() => ({
    transform: [{translateX: shimmarTranslateX.value}],
  }));

  useEffect(() => {
    shimmarTranslateX.value = withRepeat(
      withTiming(300, {duration: 3000, easing: Easing.linear}),
      -1,
      false,
    );
    if (visible) {
      setIsLoading(true);
      setUpServer();
    }
  }, [visible]);

  const setUpServer = async () => {
    const deviceName = await DeviceInfo.getDeviceName();
    const ip = await getLocalIPAddress();
    const port = 4000;
    if (server) {
      setQrValue(`tcp://${ip}:${port}${deviceName}`);
      setIsLoading(false);
      return;
    }
    startServer(port);
    setQrValue(`tcp://${ip}:${port}${deviceName}`);
    console.log(`Server Ino : ${ip}, ${port}`);
    setIsLoading(false);
  };

  useEffect(() => {
    shimmarTranslateX.value = withRepeat(
      withTiming(300, {duration: 1500, easing: Easing.linear}),
      -1,
      false,
    );
  }, [shimmarTranslateX]);

  useEffect(() => {
    if (isConnected) {
      onClose();
      navigate('ConnectionScreen');
    }
  }, [isConnected]);

  return (
    <Modal
      animationType="slide"
      visible={visible}
      presentationStyle="formSheet"
      onRequestClose={onClose}
      onDismiss={onClose}>
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.qrContainer}>
          {loading || qrValue == null || qrValue === '' ? (
            <View style={modalStyles.skeleton}>
              <Animated.View style={[modalStyles.shimmerOverlay, shimmarStyle]}>
                <LinearGradient
                  colors={['#f3f3f3', '#fff', '#f3f3f3']}
                  start={{x: 0, y: 0}}
                  style={modalStyles.shimmerGradient}
                  end={{x: 1, y: 0}}
                />
              </Animated.View>
            </View>
          ) : (
            <>
              <QRCode
                value={qrValue}
                size={250}
                logoSize={60}
                logoBackgroundColor="#fff"
                logoMargin={2}
                logoBorderRadius={10}
                logo={require('../../assets/images/profile.jpg')}
                linearGradient={multiColor}
                enableLinearGradient
              />
            </>
          )}
        </View>
        <View style={modalStyles.info}>
          <CustomeText style={modalStyles.infoText1}>
            Ensure you're on the same Wi-Fi network
          </CustomeText>
          <CustomeText style={modalStyles.infoText1}>
            {' '}
            Ask the senedr to scan this QR code to connect and transfer files.
          </CustomeText>
        </View>
        <ActivityIndicator
          size="small"
          style={{alignSelf: 'center'}}
          color="#000"
        />
        <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
          <Icon name="close" iconFamily="Ionicons" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default QRGenerateModal;

const styles = StyleSheet.create({});
