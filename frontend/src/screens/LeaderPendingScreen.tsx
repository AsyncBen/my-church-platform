import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Shield, CheckCircle } from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";

interface VerificationStep {
  label: string;
  done: boolean;
  active: boolean;
}

interface Props {
  onContinue: () => void;
}

export default function LeaderPendingScreen({ onContinue }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const steps: VerificationStep[] = [
    { label: "Account Created", done: true, active: false },
    { label: "Under Review", done: true, active: true },
    { label: "Admin Approval", done: false, active: false },
    { label: "Account Activated", done: false, active: false },
  ];

  useEffect(() => {
    // Pulse animation for the outer ring
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [pulseAnim]);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#07102A"
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.container}>
          {/* Background Glow Effect */}
          <View style={styles.backgroundGlow}>
            <View style={styles.glowCircle1} />
          </View>

          <View style={styles.content}>
            {/* Animated Shield Badge */}
            <View style={styles.badgeContainer}>
              <Animated.View
                style={[
                  styles.pulseRing,
                  {
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.3],
                      outputRange: [0.6, 0],
                    }),
                  },
                ]}
              />
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                  <Shield size={38} color="#E8C77A" />
                </View>
              </View>
            </View>

            {/* Title Section */}
            <Text style={styles.verificationLabel}>Verification Pending</Text>
            <Text style={styles.title}>
              Awaiting Admin{"\n"}Approval
            </Text>
            <Text style={styles.description}>
              Your leadership account has been submitted. Church administration
              will review your details within 24–48 hours and notify you when
              approved.
            </Text>

            {/* Status Steps */}
            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepRow,
                    index > 0 && styles.stepRowBorder,
                  ]}
                >
                  <View
                    style={[
                      styles.stepIconContainer,
                      {
                        backgroundColor: step.done
                          ? step.active
                            ? "rgba(232,199,122,0.2)"
                            : "#1B3A7A"
                          : "rgba(255,255,255,0.06)",
                      },
                    ]}
                  >
                    {step.done && !step.active && (
                      <CheckCircle size={14} color="#E8C77A" />
                    )}
                    {step.active && (
                      <View style={styles.activeDot} />
                    )}
                    {!step.done && (
                      <View style={styles.inactiveDot} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      {
                        color: step.active
                          ? "#E8C77A"
                          : step.done
                          ? "#FFFFFF"
                          : "rgba(255,255,255,0.3)",
                      },
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={onContinue}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Continue as guest for now"
            >
              <Text style={styles.continueButtonText}>
                Continue as Guest for Now
              </Text>
            </TouchableOpacity>
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
    position: "relative",
    overflow: "hidden",
  },
  backgroundGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  glowCircle1: {
    position: "absolute",
    top: "15%",
    right: "20%",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#E8C77A",
    opacity: 0.5,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  // Badge Styles
  badgeContainer: {
    position: "relative",
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "rgba(232,199,122,0.08)",
  },
  outerCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(232,199,122,0.12)",
    borderWidth: 2,
    borderColor: "rgba(232,199,122,0.3)",
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(232,199,122,0.18)",
  },
  // Title Styles
  verificationLabel: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#E8C77A",
    marginBottom: 12,
    fontFamily: SANS,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 16,
    fontFamily: SERIF,
  },
  description: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    fontFamily: SANS,
  },
  // Steps Styles
  stepsContainer: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  stepRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  stepIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E8C77A",
  },
  inactiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: SANS,
  },
  // Button Styles
  continueButton: {
    width: "100%",
    backgroundColor: "#E8C77A",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#E8C77A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: "#1B3A7A",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: SANS,
  },
});