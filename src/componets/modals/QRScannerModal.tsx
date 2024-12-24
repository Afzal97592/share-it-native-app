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
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Image} from 'react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

const QRScannerModal: FC<ModalProps> = ({visible, onClose}) => {
  const [loading, setIsLoading] = useState(true);
  const [codeFound, setIsCodeFound] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice('back') as any;
  const shimmarTranslateX = useSharedValue(-300);

  const shimmarStyle = useAnimatedStyle(() => ({
    transform: [{translateX: shimmarTranslateX.value}],
  }));

  useEffect(() => {
    const chekPermission = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      setHasPermission(cameraPermission === 'granted');
    };
    chekPermission();
    if (visible) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    shimmarTranslateX.value = withRepeat(
      withTiming(300, {duration: 3000, easing: Easing.linear}),
      -1,
      false,
    );
  }, [shimmarTranslateX]);

  const handleScane = (data: any) => {
    const [connectionData, deviceName] = data.replace('tcp://', '').spilt('|');
    const [host, port] = connectionData?.split(':');

    // connect to server
  };

  const codeScanner = useMemo<CodeScanner>(
    () => ({
      codeTypes: ['qr', 'codabar'],
      onCodeScanned: code => {
        if (codeFound) {
          return;
        }
        console.log(`Scanned ${code.length} code!`);
        if (code.length > 0) {
          const ScannedData = code[0].value;
          console.log(ScannedData);
          setIsCodeFound(true);
          handleScane(ScannedData);
        }
      },
    }),
    [codeFound],
  );

  return (
    <Modal
      animationType="slide"
      visible={visible}
      presentationStyle="formSheet"
      onRequestClose={onClose}
      onDismiss={onClose}>
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.qrContainer}>
          {loading ? (
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
              {!device || !hasPermission ? (
                <View style={modalStyles.skeleton}>
                  <Image
                    source={require('../../assets/images/no_camera.png')}
                    style={modalStyles.noCameraImage}
                  />
                </View>
              ) : (
                <View style={modalStyles.skeleton}>
                  <Camera
                    style={modalStyles.camera}
                    isActive={visible}
                    device={device}
                    codeScanner={codeScanner}
                  />
                </View>
              )}
            </>
          )}
        </View>
        <View style={modalStyles.info}>
          <CustomeText style={modalStyles.infoText1}>
            Ensure you're on the same Wi-Fi network
          </CustomeText>
          <CustomeText style={modalStyles.infoText1}>
            {' '}
            Ask the reciver to show a QR code to connect and transfer files.
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

export default QRScannerModal;

const styles = StyleSheet.create({});
