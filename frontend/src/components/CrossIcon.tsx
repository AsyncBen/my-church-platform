import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";

interface CrossIconProps {
  size?: number;
  color?: string;
}

export default function CrossIcon({
  size = 40,
  color = "#E8C77A",
}: CrossIconProps) {
  // Calculate dimensions based on size
  const verticalWidth = size * 0.2; // 20% of size
  const verticalHeight = size * 0.8; // 80% of size
  const horizontalWidth = size * 0.8;
  const horizontalHeight = size * 0.2;
  const borderRadius = size * 0.1; // 10% of size

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        {/* Vertical bar */}
        <Rect
          x={(size - verticalWidth) / 2}
          y={(size - verticalHeight) / 2}
          width={verticalWidth}
          height={verticalHeight}
          rx={borderRadius}
          fill={color}
        />
        {/* Horizontal bar */}
        <Rect
          x={(size - horizontalWidth) / 2}
          y={(size - horizontalHeight) / 2}
          width={horizontalWidth}
          height={horizontalHeight}
          rx={borderRadius}
          fill={color}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});