import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CrossIcon from "../components/CrossIcon";
import { SERIF, SANS } from "../styles/theme";

interface Props {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish?.();
    }, 2600);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusBar barStyle="light-content" backgroundColor="#07102A" />
        <View style={styles.container}>
          {/* Background Glow Effects */}
          <View style={styles.backgroundGlow1}>
            <View style={styles.glowCircle1} />
          </View>
          <View style={styles.backgroundGlow2}>
            <View style={styles.glowCircle2} />
          </View>

          {/* Icon Container */}
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <CrossIcon size={44} color="#E8C77A" />
            </View>
            <View style={styles.iconGlow} />
          </View>

          {/* Title */}
          <Text style={styles.title}>My Church</Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Stay Connected. Grow Together.
          </Text>

          {/* Navigation Dots */}
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === 1 && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#07102A",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#07102A",
  },
  // Background Glow Effects
  backgroundGlow1: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  glowCircle1: {
    position: "absolute",
    top: "20%",
    right: "30%",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#E8C77A",
    opacity: 0.5,
  },
  backgroundGlow2: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  glowCircle2: {
    position: "absolute",
    bottom: "20%",
    left: "20%",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#E8C77A",
    opacity: 0.4,
  },
  // Icon Styles
  iconContainer: {
    position: "relative",
    marginBottom: 24,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  iconGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    shadowColor: "#C4933A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 60,
    elevation: 20,
  },
  // Title Styles
  title: {
    fontFamily: SERIF,
    fontSize: 38,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: SANS,
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  // Dots Styles
  dotsContainer: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotActive: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#E8C77A",
    transform: [{ scale: 1.2 }],
  },
});