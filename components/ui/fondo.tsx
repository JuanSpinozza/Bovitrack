import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Image } from 'react-native-svg';
import { imageData } from '../../constants/imageData';

interface FondoProps {
  w: number;
  h: number;
}

export const Fondo: React.FC<FondoProps> = ({ w, h }) => {
  return (
    <View style={styles.container} pointerEvents="none">
      <Svg
        width={w}
        height={h}
        viewBox="0 0 371 792"
        preserveAspectRatio="xMidYMid slice"
        accessibilityElementsHidden
        focusable={false}
      >
        <Image
          x={0}
          y={0}
          width={w}
          height={h}
          preserveAspectRatio="xMidYMid slice"
          href={imageData}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});