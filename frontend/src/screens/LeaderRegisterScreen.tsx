import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Eye, EyeOff, Shield, ChevronDown } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import { RootStackParamList } from "../navigation/navigation";
import { SERIF, SANS } from "../styles/theme";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  ministry: string;
  password: string;
  confirmPassword: string;
}

export default function LeaderRegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = useState<{ label: string; value: string } | null>(null);
  const [roleAvailability, setRoleAvailability] = useState<{
    PASTOR: { taken: boolean };
    MEDIA: { taken: boolean };
    SECRETARY: { taken: boolean };
  } | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    ministry: "",
    password: "",
    confirmPassword: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const roles = [
    { label: "Pastor", value: "PASTOR", restricted: true },
    { label: "Media Team", value: "MEDIA", restricted: true },
    { label: "Secretary", value: "SECRETARY", restricted: true },
    { label: "Ministry Leader", value: "MEMBER", restricted: false },
    { label: "Worship Coordinator", value: "MEMBER", restricted: false },
    { label: "Elder", value: "MEMBER", restricted: false },
  ];

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchRoleAvailability = async () => {
      try {
        const availability = await authService.getRoleAvailability();
        setRoleAvailability(availability);
      } catch (err) {
        console.warn("Failed to load role availability", err);
      }
    };

    fetchRoleAvailability();
  }, []);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const requestedRole =
        selectedRole?.value !== "MEMBER" ? selectedRole?.value : undefined;

      await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        ministry: formData.ministry || undefined,
        requestedRole,
      });
      navigation.navigate("LeaderPending");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "fullName" as const,
      label: "Full Name",
      placeholder: "Your full name",
      keyboardType: "default" as const,
      autoCapitalize: "words" as const,
    },
    {
      key: "email" as const,
      label: "Email Address",
      placeholder: "your@email.com",
      keyboardType: "email-address" as const,
      autoCapitalize: "none" as const,
    },
    {
      key: "phone" as const,
      label: "Phone Number",
      placeholder: "+1 (555) 000-0000",
      keyboardType: "phone-pad" as const,
      autoCapitalize: "none" as const,
    },
    {
      key: "ministry" as const,
      label: "Ministry / Department",
      placeholder: "e.g. Youth Ministry",
      keyboardType: "default" as const,
      autoCapitalize: "words" as const,
    },
  ];

  return (
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
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={16} color="#0D1B3E" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Join as Leader</Text>
              <Text style={styles.headerSubtitle}>
                Secure verification required
              </Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Shield size={11} color="#1B3A7A" />
              <Text style={styles.verifiedText}>Verified Flow</Text>
            </View>
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Leadership Details</Text>
              <Text style={styles.description}>
                Your account will be reviewed by church administration before
                activation.
              </Text>
            </View>

            <View style={styles.formSection}>
              {/* Form Fields */}
              {fields.map(
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

              {/* Role Dropdown */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Leadership Role</Text>
                <TouchableOpacity
                  style={[
                    styles.inputContainer,
                    styles.dropdownButton,
                    roleOpen && styles.inputFocused,
                  ]}
                  onPress={() => setRoleOpen(!roleOpen)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Select role, ${selectedRole?.label || "none selected"}`}
                  accessibilityState={{ expanded: roleOpen }}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      !selectedRole && styles.dropdownPlaceholder,
                    ]}
                  >
                    {selectedRole?.label || "Select your role"}
                  </Text>
                  <ChevronDown
                    size={15}
                    color="#7B7464"
                    style={{
                      transform: [{ rotate: roleOpen ? "180deg" : "0deg" }],
                    }}
                  />
                </TouchableOpacity>

                {/* Dropdown Modal */}
                <Modal
                  visible={roleOpen}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setRoleOpen(false)}
                >
                  <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setRoleOpen(false)}
                  >
                    <View style={styles.dropdownContainer}>
                      <FlatList
                        data={roles}
                        keyExtractor={(item) => item.value + item.label}
                        renderItem={({ item, index }) => {
                          const disabled =
                            item.restricted &&
                            item.value !== "MEMBER" &&
                            roleAvailability?.[item.value as "PASTOR" | "MEDIA" | "SECRETARY"]?.taken;

                          return (
                            <TouchableOpacity
                              style={[
                                styles.dropdownItem,
                                index > 0 && styles.dropdownItemBorder,
                                disabled && { opacity: 0.4 },
                              ]}
                              onPress={() => {
                                if (disabled) {
                                  return;
                                }
                                setSelectedRole(item);
                                setRoleOpen(false);
                              }}
                              activeOpacity={0.7}
                              accessibilityRole="menuitem"
                              accessibilityLabel={item.label}
                            >
                              <View style={styles.dropdownItemRow}>
                                <Text style={styles.dropdownItemText}>{item.label}</Text>
                                {disabled ? (
                                  <Text style={styles.filledText}>(Filled)</Text>
                                ) : null}
                              </View>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>
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
                    placeholder="Create a secure password"
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

              {/* Verification Notice */}
              <View style={styles.verificationNotice}>
                <Shield
                  size={16}
                  color="#C4933A"
                  style={styles.verificationIcon}
                />
                <Text style={styles.verificationText}>
                  Your account will be reviewed within 24–48 hours. You will
                  receive a notification once approved by church administration.
                </Text>
              </View>

              {/* Submit Button */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Submit for verification"
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? "Submitting..." : "Submit for Verification"}
                </Text>
              </TouchableOpacity>
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
  headerSubtitle: {
    fontSize: 10,
    color: "#7B7464",
    fontFamily: SANS,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#EDF0F8",
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1B3A7A",
    fontFamily: SANS,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  // Title Section Styles
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SERIF,
  },
  description: {
    fontSize: 11,
    color: "#7B7464",
    marginTop: 4,
    lineHeight: 18,
    fontFamily: SANS,
  },
  // Form Styles
  formSection: {
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
  // Dropdown Styles
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 14,
    color: "#0D1B3E",
    fontFamily: SANS,
  },
  dropdownPlaceholder: {
    color: "#C0B8B0",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0EDE6",
    maxHeight: 300,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dropdownItemBorder: {
    borderTopWidth: 1,
    borderTopColor: "#F0EDE6",
  },
  dropdownItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#0D1B3E",
    fontWeight: "500",
    fontFamily: SANS,
  },
  filledText: {
    fontSize: 12,
    color: "#7B7464",
    fontFamily: SANS,
  },
  // Password Styles
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  passwordInput: {
    flex: 1,
  },
  // Verification Notice Styles
  verificationNotice: {
    backgroundColor: "#FDF6E8",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 12,
  },
  verificationIcon: {
    flexShrink: 0,
    marginTop: 2,
  },
  verificationText: {
    fontSize: 11,
    color: "#7B7464",
    lineHeight: 18,
    flex: 1,
    fontFamily: SANS,
  },
  // Submit Button Styles
  submitButton: {
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
  submitButtonDisabled: {
    backgroundColor: "#7B8AB0",
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    textAlign: "center",
    fontFamily: SANS,
    marginBottom: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: SANS,
  },
});