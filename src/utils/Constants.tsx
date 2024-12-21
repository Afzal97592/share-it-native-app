import {Dimensions, Platform} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const requestPhotoPermission = async () => {
  if (Platform.OS !== 'ios') {
    return;
  }
  try {
    const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (result === RESULTS.GRANTED) {
      console.log('STORAGE PERMISSION GRANTED ✅');
    } else {
      console.log('STORAGE PERMISSION DENIED ❌');
    }
  } catch (error) {
    console.error('Error requesting permission:', error);
  }
};

export const isBase64 = (str: string) => {
  const base64Regex =
    /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
  return base64Regex.test(str);
};

export const screenHeight = Dimensions.get('screen').height;
export const screenWidth = Dimensions.get('screen').width;
export const multiColor = [
  '#0B3D91',
  '#1E4DFF',
  '#104E8B',
  '#4682B4',
  '#6A5ACD',
  '#7B68EE',
];
export const svgPath =
  'M0,32L48,37.3C96,43,192,53,288,85.3C384,117,480,171,576,202.7C672,235,768,245,864,213.3C960,181,1056,107,1152,112C1248,117,1344,203,1392,245.3L1440,288L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z';

export enum Colors {
  primary = '#007AFF',
  background = '#fff',
  text = '#222',
  theme = '#CF551F',
  secondary = '#E5EBF5',
  tertiary = '#3C75BE',
  secondary_light = '#F6F7F9',
}
