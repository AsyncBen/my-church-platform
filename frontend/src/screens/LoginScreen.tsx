import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import CrossIcon from "../components/CrossIcon";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/navigation";
import { SERIF, SANS } from "../styles/theme";

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigation.navigate("Root" as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      {/* ✅ STATUS BAR FIX */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7F5F0"
        translucent={false}
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header with Back Button */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <ArrowLeft size={18} color="#0D1B3E" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
              {/* ✅ ICON + TITLE SIDE BY SIDE */}
              <View style={styles.welcomeSection}>
                <View style={styles.iconContainer}>
                  <CrossIcon size={22} color="rgba(232,199,122,0.9)" />
                </View>

                <View style={styles.welcomeTextContainer}>
                  <Text style={styles.title}>Welcome back</Text>
                  <Text style={styles.subtitle}>
                    Sign in to your church account
                  </Text>
                </View>
              </View>

              {/* Form Fields */}
              <View style={styles.form}>
                {/* Email Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Email Address</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      isFocused.email && styles.inputFocused,
                    ]}
                  >
                    <Mail size={15} color="#7B7464" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="your@email.com"
                      placeholderTextColor="#C0B8B0"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() =>
                        setIsFocused((prev) => ({ ...prev, email: true }))
                      }
                      onBlur={() =>
                        setIsFocused((prev) => ({ ...prev, email: false }))
                      }
                    />
                  </View>
                </View>

                {/* Password Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      isFocused.password && styles.inputFocused,
                    ]}
                  >
                    <Lock size={15} color="#7B7464" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="••••••••"
                      placeholderTextColor="#C0B8B0"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      onFocus={() =>
                        setIsFocused((prev) => ({ ...prev, password: true }))
                      }
                      onBlur={() =>
                        setIsFocused((prev) => ({ ...prev, password: false }))
                      }
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      activeOpacity={0.6}
                    >
                      {showPassword ? (
                        <EyeOff size={15} color="#7B7464" />
                      ) : (
                        <Eye size={15} color="#7B7464" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity
                  style={styles.forgotButton}
                  onPress={() => {}}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : null}

                {/* Sign In */}
                <TouchableOpacity
                  style={[
                    styles.signInButton,
                    loading && styles.signInButtonDisabled,
                  ]}
                  onPress={handleLogin}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  <Text style={styles.signInText}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Create Account */}
              <View style={styles.createAccount}>
                <Text style={styles.createAccountText}>New member? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("RoleSelect")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.createAccountLink}>
                    Create Account
                  </Text>
                </TouchableOpacity>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0EDE6",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  /* ✅ UPDATED WELCOME SECTION */
  welcomeSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },

  welcomeTextContainer: {
    marginLeft: 14,
    flex: 1,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B3A7A",
    shadowColor: "#1B3A7A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SERIF,
  },

  subtitle: {
    fontSize: 14,
    color: "#7B7464",
    marginTop: 2,
    fontFamily: SANS,
  },

  form: {
    gap: 16,
  },

  fieldContainer: {
    gap: 8,
  },

  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#7B7464",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: SANS,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },

  inputFocused: {
    borderColor: "#1B3A7A",
    backgroundColor: "#FFFFFF",
  },

  inputIcon: {
    flexShrink: 0,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#0D1B3E",
    fontFamily: SANS,
    padding: 0,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -4,
  },

  forgotText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#C4933A",
    fontFamily: SANS,
  },

  signInButton: {
    backgroundColor: "#1B3A7A",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 4,
  },

  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    textAlign: "center",
    fontFamily: SANS,
    marginBottom: 8,
  },

  signInText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: SANS,
  },

  signInButtonDisabled: {
    backgroundColor: "#7B8AB0",
  },

  createAccount: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    paddingBottom: 24,
  },

  createAccountText: {
    fontSize: 14,
    color: "#7B7464",
    fontFamily: SANS,
  },

  createAccountLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1B3A7A",
    fontFamily: SANS,
  },
});