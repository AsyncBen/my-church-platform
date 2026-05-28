import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  Bell,
  Lock,
  Moon,
  Globe,
  HelpCircle,
  Shield,
  Info,
  ChevronRight,
  Smartphone,
} from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";
import { useAuth } from "../context/AuthContext";

export default function AccountSettingsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoPlayVideos, setAutoPlayVideos] = useState(true);

  const handleChangePassword = () => {
    Alert.alert("Coming Soon", "Password change will be available in the next update.");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("Account Deleted", "Your account has been scheduled for deletion.");
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          type: "toggle",
          value: pushNotifications,
          onToggle: setPushNotifications,
        },
        {
          icon: Smartphone,
          label: "In-App Alerts",
          type: "toggle",
          value: true,
          onToggle: () => {},
        },
      ],
    },
    {
      title: "Appearance",
      items: [
        {
          icon: Moon,
          label: "Dark Mode",
          type: "toggle",
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          icon: Globe,
          label: "Language",
          type: "navigate",
          value: "English",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Content",
      items: [
        {
          icon: Lock,
          label: "Auto-Play Videos",
          type: "toggle",
          value: autoPlayVideos,
          onToggle: setAutoPlayVideos,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: Lock,
          label: "Change Password",
          type: "navigate",
          value: undefined,
          onPress: handleChangePassword,
        },
        {
          icon: Shield,
          label: "Privacy Policy",
          type: "navigate",
          value: undefined,
          onPress: () => {},
        },
        {
          icon: Info,
          label: "Terms of Service",
          type: "navigate",
          value: undefined,
          onPress: () => {},
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          type: "navigate",
          value: undefined,
          onPress: () => {},
        },
        {
          icon: Info,
          label: "About",
          type: "navigate",
          value: undefined,
          onPress: () => {
            Alert.alert(
              "My Church Platform",
              "Version 1.0.0\n\n© 2026 Your Church Name\nAll rights reserved."
            );
          },
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
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
        <Text style={styles.headerTitle}>Account Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Summary */}
        <View style={styles.profileCard}>
          <Text style={styles.profileName}>{user?.name ?? "Member"}</Text>
          <Text style={styles.profileEmail}>{user?.email ?? ""}</Text>
          <Text style={styles.profileRole}>
            {user?.role ?? "Member"}
            {user?.ministry ? ` · ${user.ministry}` : ""}
          </Text>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View
            key={section.title}
            style={[
              styles.sectionCard,
              sectionIndex > 0 && styles.sectionCardMargin,
            ]}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            {section.items.map((item, itemIndex) => (
              <View
                key={item.label}
                style={[
                  styles.settingItem,
                  itemIndex > 0 && styles.settingItemBorder,
                ]}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <item.icon size={15} color="#1B3A7A" />
                  </View>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                
                <View style={styles.settingRight}>
                  {item.type === "toggle" ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: "#E2E4E8", true: "#1B3A7A" }}
                      thumbColor="#FFFFFF"
                    />
                  ) : item.type === "navigate" ? (
                    <View style={styles.navigateContainer}>
                      {item.value && (
                        <Text style={styles.settingValue}>{item.value}</Text>
                      )}
                      <TouchableOpacity
                        onPress={item.onPress}
                        activeOpacity={0.7}
                        style={styles.chevronButton}
                      >
                        <ChevronRight size={13} color="#B0A89A" />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* Danger Zone */}
        <View style={[styles.sectionCard, styles.sectionCardMargin]}>
          <Text style={styles.sectionTitleDanger}>Danger Zone</Text>
          
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Delete account"
          >
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F5F0",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(13,27,62,0.06)",
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0EDE6",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SERIF,
  },
  headerSpacer: {
    width: 36,
  },
  scrollContent: {
    padding: 16,
  },
  // Profile Card
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SERIF,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: "#7B7464",
    fontFamily: SANS,
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 11,
    color: "#1B3A7A",
    fontWeight: "500",
    fontFamily: SANS,
  },
  // Section Card
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionCardMargin: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#7B7464",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 16,
    fontFamily: SANS,
  },
  sectionTitleDanger: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#DC2626",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 16,
    fontFamily: SANS,
  },
  // Setting Item
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  settingItemBorder: {
    borderTopWidth: 1,
    borderTopColor: "#F0EDE6",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF0F8",
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#0D1B3E",
    fontFamily: SANS,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  navigateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 12,
    color: "#7B7464",
    fontFamily: SANS,
  },
  chevronButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  // Danger Zone
  dangerButton: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  dangerButtonText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
    fontFamily: SANS,
    textAlign: "center",
  },
  bottomSpacer: {
    height: 32,
  },
});