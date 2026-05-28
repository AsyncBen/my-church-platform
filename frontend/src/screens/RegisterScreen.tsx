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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { SERIF, SANS } from "../styles/theme";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });
      // No navigation needed - auth state change will switch navigators
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "fullName", label: "Full Name", placeholder: "Your full name", keyboardType: "default" as const, autoCapitalize: "words" as const },
    { key: "email", label: "Email Address", placeholder: "your@email.com", keyboardType: "email-address" as const, autoCapitalize: "none" as const },
    { key: "phone", label: "Phone Number", placeholder: "+1 (555) 000-0000", keyboardType: "phone-pad" as const, autoCapitalize: "none" as const },
  ];

  return (
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
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Join the family</Text>
              <Text style={styles.subtitle}>
                Create your church account to get started
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              {fields.map(({ key, label, placeholder, keyboardType, autoCapitalize }) => (
                <View key={key} style={styles.fieldContainer}>
                  <Text style={styles.label}>{label}</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedField === key && styles.inputFocused,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      value={formData[key as keyof FormData]}
                      onChangeText={(value) => updateField(key as keyof FormData, value)}
                      placeholder={placeholder}
                      placeholderTextColor="#C0B8B0"
                      keyboardType={keyboardType}
                      autoCapitalize={autoCapitalize}
                      autoCorrect={false}
                      onFocus={() => setFocusedField(key)}
                      onBlur={() => setFocusedField(null)}
                      accessibilityLabel={label}
                    />
                  </View>
                </View>
              ))}

              {/* Password Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[
                    styles.inputContainer,
                    styles.passwordContainer,
                    focusedField === "password" && styles.inputFocused,
                  ]}
                >
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={formData.password}
                    onChangeText={(value) => updateField("password", value)}
                    placeholder="Create a strong password"
                    placeholderTextColor="#C0B8B0"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    accessibilityLabel="Password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.6}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={15} color="#7B7464" />
                    ) : (
                      <Eye size={15} color="#7B7464" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              {/* Register Button */}
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  loading && styles.registerButtonDisabled,
                ]}
                onPress={handleRegister}
                activeOpacity={0.8}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Create your account"
              >
                <Text style={styles.registerButtonText}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>

              {/* Terms and Privacy */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By registering you agree to our{" "}
                </Text>
                <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
                  <Text style={styles.termsLink}>Terms of Service</Text>
                </TouchableOpacity>
                <Text style={styles.termsText}> and </Text>
                <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0D1B3E",
    marginBottom: 4,
    fontFamily: SERIF,
  },
  subtitle: {
    fontSize: 14,
    color: "#7B7464",
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
    backgroundColor: "#F7F5F0",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: "#1B3A7A",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 14,
    color: "#0D1B3E",
    fontFamily: SANS,
    padding: 0,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  passwordInput: {
    flex: 1,
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    textAlign: "center",
    fontFamily: SANS,
    marginBottom: -8,
  },
  registerButton: {
    backgroundColor: "#1B3A7A",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#1B3A7A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonDisabled: {
    backgroundColor: "#7B8AB0",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: SANS,
  },
  termsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 24,
  },
  termsText: {
    fontSize: 10,
    color: "#7B7464",
    fontFamily: SANS,
    textAlign: "center",
  },
  termsLink: {
    fontSize: 10,
    color: "#C4933A",
    fontWeight: "600",
    fontFamily: SANS,
  },
});