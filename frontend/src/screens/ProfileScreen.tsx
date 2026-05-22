import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Settings, ChevronRight, FileText, Gift, History, Bookmark } from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const STAT_CARD_WIDTH = (SCREEN_WIDTH - 56) / 3; // Accounting for padding and gaps

interface Ministry {
  label: string;
  imageId: string;
  role: string;
}

interface QuickLink {
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  action: () => void;
}

interface Props {
  onNotes: () => void;
  onGive: () => void;
  onGivingHistory: () => void;
  onBookmarked?: () => void;
  onAccountSettings?: () => void;
  onMinistryPress?: (ministry: Ministry) => void;
}

export default function ProfileScreen({
  onNotes,
  onGive,
  onGivingHistory,
  onBookmarked,
  onAccountSettings,
  onMinistryPress,
}: Props) {
  const stats = [
    { label: "Sermons", value: "48" },
    { label: "Notes", value: "23" },
    { label: "Prayers", value: "87" },
  ];

  const ministries: Ministry[] = [
    {
      label: "Youth Ministry",
      imageId: "1529156069898-49953e39b3ac",
      role: "Active member",
    },
    {
      label: "Worship Team",
      imageId: "1511367461989-f85a21fda167",
      role: "Active member",
    },
  ];

  const quickLinks: QuickLink[] = [
    { label: "Sermon Notes", icon: FileText, action: onNotes },
    { label: "Give an Offering", icon: Gift, action: onGive },
    { label: "Giving History", icon: History, action: onGivingHistory },
    { label: "Bookmarked Scriptures", icon: Bookmark, action: onBookmarked || (() => {}) },
    { label: "Account Settings", icon: Settings, action: onAccountSettings || (() => {}) },
  ];

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#07102A" />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>My Profile</Text>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={onAccountSettings}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Account settings"
              >
                <Settings size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Profile Info */}
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
                  }}
                  style={styles.avatar}
                  accessibilityLabel="Profile picture"
                />
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>Michael Johnson</Text>
                <Text style={styles.memberSince}>Member since January 2023</Text>
                <View style={styles.roleContainer}>
                  <View style={styles.roleDot} />
                  <Text style={styles.roleText}>Youth Ministry Leader</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.content}>
            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              {stats.map(({ label, value }) => (
                <View key={label} style={styles.statCard}>
                  <Text style={styles.statValue}>{value}</Text>
                  <Text style={styles.statLabel}>{label}</Text>
                </View>
              ))}
            </View>

            {/* Ministries Section */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>My Ministries</Text>
              {ministries.map((ministry, index) => (
                <TouchableOpacity
                  key={ministry.label}
                  style={[
                    styles.ministryItem,
                    index > 0 && styles.ministryItemBorder,
                  ]}
                  onPress={() => onMinistryPress?.(ministry)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`${ministry.label}, ${ministry.role}`}
                >
                  <View style={styles.ministryImageContainer}>
                    <Image
                      source={{
                        uri: `https://images.unsplash.com/photo-${ministry.imageId}?w=60&h=60&fit=crop&auto=format`,
                      }}
                      style={styles.ministryImage}
                    />
                  </View>
                  <View style={styles.ministryInfo}>
                    <Text style={styles.ministryName}>{ministry.label}</Text>
                    <Text style={styles.ministryRole}>{ministry.role}</Text>
                  </View>
                  <ChevronRight size={13} color="#B0A89A" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick Links Section */}
            <View style={styles.sectionCard}>
              {quickLinks.map(({ label, icon: Icon, action }, index) => (
                <TouchableOpacity
                  key={label}
                  style={[
                    styles.quickLinkItem,
                    index > 0 && styles.quickLinkItemBorder,
                  ]}
                  onPress={action}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                >
                  <View style={styles.quickLinkIcon}>
                    <Icon size={15} color="#1B3A7A" />
                  </View>
                  <Text style={styles.quickLinkText}>{label}</Text>
                  <ChevronRight size={13} color="#B0A89A" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Bottom Spacer */}
            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>
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
    paddingBottom: 95,
  },
  // Header Styles
  header: {
    backgroundColor: "#07102A",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: SERIF,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 2.5,
    borderColor: "#E8C77A",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 17,
    fontFamily: SANS,
  },
  memberSince: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    marginTop: 2,
    fontFamily: SANS,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E8C77A",
  },
  roleText: {
    color: "#E8C77A",
    fontSize: 10,
    fontWeight: "500",
    fontFamily: SANS,
  },
  // Content Styles
  content: {
    paddingHorizontal: 16,
    marginTop: -20,
    gap: 16,
  },
  // Stats Styles
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B3A7A",
    fontFamily: SANS,
  },
  statLabel: {
    fontSize: 9,
    color: "#7B7464",
    marginTop: 2,
    fontFamily: SANS,
  },
  // Section Card Styles
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0D1B3E",
    marginBottom: 12,
    fontFamily: SERIF,
  },
  // Ministry Styles
  ministryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  ministryItemBorder: {
    borderTopWidth: 1,
    borderTopColor: "#F0EDE6",
  },
  ministryImageContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#EDF0F8",
  },
  ministryImage: {
    width: "100%",
    height: "100%",
  },
  ministryInfo: {
    flex: 1,
  },
  ministryName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0D1B3E",
    fontFamily: SANS,
  },
  ministryRole: {
    fontSize: 9,
    color: "#7B7464",
    marginTop: 1,
    fontFamily: SANS,
  },
  // Quick Link Styles
  quickLinkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  quickLinkItemBorder: {
    borderTopWidth: 1,
    borderTopColor: "#F0EDE6",
  },
  quickLinkIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF0F8",
  },
  quickLinkText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#0D1B3E",
    textAlign: "left",
    fontFamily: SANS,
  },
  bottomSpacer: {
    height: 16,
  },
});