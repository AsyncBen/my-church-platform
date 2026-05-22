import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CrossIcon from "../components/CrossIcon";
import { SERIF, SANS } from "../styles/theme";

interface Props {
  onLogin: () => void;
  onRegister: () => void;
  onGuest: () => void;
}

export default function WelcomeScreen({ onLogin, onRegister, onGuest }: Props) {
  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            {/* Dark Header Section */}
            <View style={styles.heroContainer}>
              {/* Background gradient */}
              <View style={styles.heroBackground} />
              
              {/* Decorative circles */}
              <View style={styles.decorCircle1} />
              <View style={styles.decorCircle2} />
              
              {/* Logo */}
              <View style={styles.logoContainer}>
                <View style={styles.logoIconWrapper}>
                  <CrossIcon size={36} color="#E8C77A" />
                </View>
                <Text style={styles.logoText}>My Church</Text>
                <Text style={styles.logoSubtext}>Stay Connected. Grow Together.</Text>
              </View>
            </View>

            {/* Content Section - pushed up with negative margin */}
            <View style={styles.contentWrapper}>
              <View style={styles.contentContainer}>
                <Text style={styles.welcomeLabel}>Welcome to</Text>
                <Text style={styles.title}>
                  Your Digital{"\n"}Church Home
                </Text>
                <Text style={styles.description}>
                  Connect with your congregation, follow live services, grow
                  spiritually — all in one place.
                </Text>

                {/* Main Action Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={onLogin}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Sign In to Your Account"
                  >
                    <Text style={styles.primaryButtonText}>
                      Sign In to Your Account
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={onRegister}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Create New Account"
                  >
                    <Text style={styles.secondaryButtonText}>
                      Create New Account
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.guestButton}
                    onPress={onGuest}
                    activeOpacity={0.6}
                    accessibilityRole="button"
                    accessibilityLabel="Continue as Guest"
                  >
                    <Text style={styles.guestButtonText}>Continue as Guest</Text>
                  </TouchableOpacity>
                </View>

                {/* Social Sign In */}
                <View style={styles.socialSection}>
                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>or sign in with</Text>
                    <View style={styles.divider} />
                  </View>
                  <View style={styles.socialButtonsContainer}>
                    {["Google", "Apple"].map((provider) => (
                      <TouchableOpacity
                        key={provider}
                        style={styles.socialButton}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel={`Sign in with ${provider}`}
                      >
                        <Text style={styles.socialButtonText}>{provider}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F5F0",
  },
  scrollContent: {
    flexGrow: 1,
  },
  // Hero Section
  heroContainer: {
    height: 380,
    overflow: "hidden",
    position: "relative",
    marginTop: -50, // Pull up to cover status bar
  },
  heroBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#07102A",
    // Simulated gradient using multiple views
  },
  decorCircle1: {
    position: "absolute",
    top: "10%",
    right: "20%",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#1B3A7A",
    opacity: 0.3,
  },
  decorCircle2: {
    position: "absolute",
    bottom: "30%",
    left: "15%",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#C4933A",
    opacity: 0.1,
  },
  logoContainer: {
    position: "absolute",
    top: "35%",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingTop: 50,
  },
  logoIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginBottom: 16,
    shadowColor: "#C4933A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: 8,
    fontFamily: SERIF,
    letterSpacing: 0.5,
  },
  logoSubtext: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: SANS,
  },
  // Content Wrapper - pushed up
  contentWrapper: {
    marginTop: -30, // Negative margin to push content up into hero area
    backgroundColor: "#F7F5F0",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  welcomeLabel: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#C4933A",
    marginBottom: 4,
    fontFamily: SANS,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0D1B3E",
    lineHeight: 36,
    marginBottom: 8,
    fontFamily: SERIF,
  },
  description: {
    color: "#7B7464",
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 24,
    fontFamily: SANS,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#1B3A7A",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#1B3A7A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: SANS,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(27,58,122,0.18)",
  },
  secondaryButtonText: {
    color: "#1B3A7A",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: SANS,
  },
  guestButton: {
    paddingVertical: 8,
    alignItems: "center",
  },
  guestButtonText: {
    fontSize: 12,
    color: "#7B7464",
    fontWeight: "500",
    fontFamily: SANS,
  },
  socialSection: {
    marginTop: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8E4DC",
  },
  dividerText: {
    fontSize: 10,
    color: "#B0A89A",
    fontFamily: SANS,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E8E4DC",
    alignItems: "center",
    justifyContent: "center",
  },
  socialButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0D1B3E",
    fontFamily: SANS,
  },
});