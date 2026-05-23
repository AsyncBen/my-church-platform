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
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/navigation";
import { SERIF, SANS } from "../styles/theme";

interface Ministry {
  name: string;
  icon: string;
}

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function MemberRegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState("");
  const [ministry, setMinistry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const ministries: Ministry[] = [
    { name: "Youth Ministry", icon: "🎯" },
    { name: "Worship Team", icon: "🎵" },
    { name: "Media Team", icon: "🎬" },
    { name: "Men Fellowship", icon: "🤝" },
    { name: "Women Fellowship", icon: "🌸" },
    { name: "Children Ministry", icon: "⭐" },
  ];

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    setStep(2);
  };

  const handleComplete = async () => {
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigation.goBack();
    } else {
      setStep(1);
    }
  };

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Prefer not to say" },
  ];

  const personalFields = [
    {
      key: "fullName" as const,
      label: "Full Name",
      placeholder: "Your full name",
      keyboardType: "default" as const,
      autoCapitalize: "words" as const,
    },
    {
      key: "phone" as const,
      label: "Phone Number",
      placeholder: "+1 (555) 000-0000",
      keyboardType: "phone-pad" as const,
      autoCapitalize: "none" as const,
    },
    {
      key: "email" as const,
      label: "Email Address (optional)",
      placeholder: "your@email.com",
      keyboardType: "email-address" as const,
      autoCapitalize: "none" as const,
    },
  ];

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F0EDE6"
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={step === 1 ? "Go back" : "Go to previous step"}
            >
              <ArrowLeft size={16} color="#0D1B3E" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Join as Member</Text>
              <Text style={styles.headerStep}>Step {step} of 2</Text>
            </View>
            <View style={styles.stepIndicators}>
              {[1, 2].map((s) => (
                <View
                  key={s}
                  style={[
                    styles.stepDot,
                    {
                      width: s <= step ? 24 : 12,
                      backgroundColor: s <= step ? "#1B3A7A" : "#E8E4DC",
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 1 ? (
              <View style={styles.formSection}>
                {/* Step 1 Header */}
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>Personal Details</Text>
                  <Text style={styles.stepDescription}>
                    Tell us a little about yourself
                  </Text>
                </View>

                {/* Personal Fields */}
                {personalFields.map(
                  ({ key, label, placeholder, keyboardType, autoCapitalize }) => (
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
                          value={formData[key]}
                          onChangeText={(value) => updateField(key, value)}
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
                  )
                )}

                {/* Gender Selection */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.genderContainer}>
                    {genderOptions.map((g) => (
                      <TouchableOpacity
                        key={g.value}
                        onPress={() => setGender(g.value)}
                        style={[
                          styles.genderButton,
                          {
                            backgroundColor:
                              gender === g.value ? "#1B3A7A" : "#F7F5F0",
                          },
                        ]}
                        activeOpacity={0.7}
                        accessibilityRole="radio"
                        accessibilityLabel={g.label}
                        accessibilityState={{ selected: gender === g.value }}
                      >
                        <Text
                          style={[
                            styles.genderButtonText,
                            {
                              color:
                                gender === g.value ? "#FFFFFF" : "#7B7464",
                            },
                          ]}
                        >
                          {g.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

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
                      placeholder="Create a password"
                      placeholderTextColor="#C0B8B0"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      accessibilityLabel="Password"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((prev) => !prev)}
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

                {/* Confirm Password Field */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedField === "confirmPassword" && styles.inputFocused,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      value={formData.confirmPassword}
                      onChangeText={(value) =>
                        updateField("confirmPassword", value)
                      }
                      placeholder="Repeat your password"
                      placeholderTextColor="#C0B8B0"
                      secureTextEntry
                      autoCapitalize="none"
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      accessibilityLabel="Confirm password"
                    />
                  </View>
                </View>

                {/* Continue Button */}
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleContinue}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Continue to next step"
                >
                  <Text style={styles.primaryButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.formSection}>
                {/* Step 2 Header */}
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>Choose a Ministry</Text>
                  <Text style={styles.stepDescription}>
                    Select a ministry you would like to connect with
                  </Text>
                </View>

                {/* Ministry Grid */}
                <View style={styles.ministryGrid}>
                  {ministries.map((m) => (
                    <TouchableOpacity
                      key={m.name}
                      onPress={() => setMinistry(m.name)}
                      style={[
                        styles.ministryCard,
                        {
                          backgroundColor:
                            ministry === m.name ? "#EDF0F8" : "#F7F5F0",
                          borderColor:
                            ministry === m.name
                              ? "#1B3A7A"
                              : "transparent",
                          borderWidth: 2,
                        },
                      ]}
                      activeOpacity={0.7}
                      accessibilityRole="radio"
                      accessibilityLabel={m.name}
                      accessibilityState={{ selected: ministry === m.name }}
                    >
                      <Text style={styles.ministryIcon}>{m.icon}</Text>
                      <Text style={styles.ministryName}>{m.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.ministryNote}>
                  You can join more ministries after signing up
                </Text>

                {/* Complete Registration Button */}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleComplete}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Complete registration"
                  disabled={loading}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? "Creating account..." : "Complete Registration"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
    backgroundColor: "#F0EDE6",
  },
  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SANS,
  },
  headerStep: {
    fontSize: 10,
    color: "#7B7464",
    fontFamily: SANS,
  },
  stepIndicators: {
    flexDirection: "row",
    gap: 6,
  },
  stepDot: {
    height: 6,
    borderRadius: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  // Form Styles
  formSection: {
    gap: 16,
  },
  stepHeader: {
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SERIF,
  },
  stepDescription: {
    fontSize: 11,
    color: "#7B7464",
    marginTop: 4,
    fontFamily: SANS,
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
    backgroundColor: "#FFFFFF",
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
  // Gender Styles
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  genderButtonText: {
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: SANS,
  },
  // Primary Button Styles
  primaryButton: {
    backgroundColor: "#1B3A7A",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#1B3A7A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: "#7B8AB0",
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    textAlign: "center",
    fontFamily: SANS,
    marginBottom: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: SANS,
  },
  // Ministry Grid Styles
  ministryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  ministryCard: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
  },
  ministryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  ministryName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0D1B3E",
    lineHeight: 16,
    fontFamily: SANS,
  },
  ministryNote: {
    fontSize: 10,
    color: "#B0A89A",
    textAlign: "center",
    fontFamily: SANS,
  },
});