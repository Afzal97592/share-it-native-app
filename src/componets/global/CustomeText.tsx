import {StyleSheet, Text, View, TextStyle, Platform} from 'react-native';
import React, {FC} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../../utils/Constants';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7';
type PlatformType = 'ios' | 'android';

interface CustomeTextProps {
  variant?: Variant;
  fontfamily?:
    | 'Okra-Bold'
    | 'Okra-Regular'
    | 'Okra-Black'
    | 'Okra-Light'
    | 'Okra-Medium';
  fontSize?: number;
  color?: string;
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
  onLayout?: (event: any) => void;
  numbersOfLines?: number;
}

const fontSizeMap: Record<Variant, Record<PlatformType, number>> = {
  h1: {android: 24, ios: 22},
  h2: {android: 22, ios: 20},
  h3: {android: 20, ios: 18},
  h4: {android: 18, ios: 16},
  h5: {android: 16, ios: 14},
  h6: {android: 12, ios: 10},
  h7: {android: 10, ios: 9},
};

const CustomeText: FC<CustomeTextProps> = ({
  variant,
  fontfamily = 'Okra-Regular',
  fontSize,
  color,
  style,
  children,
  onLayout,
  numbersOfLines,
  ...props
}) => {
  let computedFontSize: number =
    Platform.OS === 'android'
      ? RFValue(fontSize || 12)
      : RFValue(fontSize || 10);

  if (variant && fontSizeMap[variant]) {
    const defaultSize = fontSizeMap[variant][Platform.OS as PlatformType];
    computedFontSize = RFValue(defaultSize);
  }

  const fontFamilyStyle = {
    fontfamily,
  };

  return (
    <Text
      style={{
        ...styles.text,
        ...style,
        color: color || Colors.text,
        fontSize: computedFontSize,
        ...fontFamilyStyle,
      }}
      numberOfLines={numbersOfLines !== undefined ? numbersOfLines : undefined}
      onLayout={onLayout}
      {...props}>
      {children}
    </Text>
  );
};

export default CustomeText;

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});
