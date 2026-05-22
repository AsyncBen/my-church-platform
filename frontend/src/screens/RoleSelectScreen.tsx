import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ChevronRight, User, Shield } from "lucide-react-native";
import { SERIF, SANS } from "../styles/theme";

interface Props {
  onBack: () => void;
  onMember: () => void;
  onLeader: () => void;
}

export default function RoleSelectScreen({ onBack, onMember, onLeader }: Props) {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7F5F0"
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={17} color="#0D1B3E" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.welcomeLabel}>Welcome</Text>
              <Text style={styles.title}>
                How are you joining{"\n"}the community?
              </Text>
              <Text style={styles.description}>
                Choose the role that best describes you. You can always update
                this later.
              </Text>
            </View>

            {/* Role Cards */}
            <View style={styles.cardsContainer}>
              {/* Member Card */}
              <TouchableOpacity
                style={styles.memberCard}
                onPress={onMember}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel="Join as Church Member"
              >
                <View style={styles.cardDecorCircle}>
                  <View style={styles.memberDecor} />
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.memberIconContainer}>
                    <User size={26} color="#1B3A7A" />
                  </View>
                  <View style={styles.cardTextContent}>
                    <Text style={styles.memberTitle}>Church Member</Text>
                    <Text style={styles.memberDescription}>
                      Join services, access sermons, connect with ministries,
                      and grow in faith with the community.
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#1B3A7A" style={styles.chevron} />
                </View>
              </TouchableOpacity>

              {/* Leader Card */}
              <TouchableOpacity
                style={styles.leaderCard}
                onPress={onLeader}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel="Join as Church Leader"
              >
                <View style={styles.cardDecorCircle}>
                  <View style={styles.leaderDecor} />
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.leaderIconContainer}>
                    <Shield size={26} color="#E8C77A" />
                  </View>
                  <View style={styles.cardTextContent}>
                    <Text style={styles.leaderTitle}>Church Leader</Text>
                    <Text style={styles.leaderDescription}>
                      Pastors, elders, ministry leaders, and team coordinators.
                      Requires admin verification.
                    </Text>
                  </View>
                  <ChevronRight size={16} color="rgba(255,255,255,0.6)" style={styles.chevron} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleSection: {
    marginBottom: 32,
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#0D1B3E",
    lineHeight: 34,
    marginBottom: 8,
    fontFamily: SERIF,
  },
  description: {
    fontSize: 14,
    color: "#7B7464",
    lineHeight: 22,
    fontFamily: SANS,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  // Member Card Styles
  memberCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(27,58,122,0.12)",
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  memberDecor: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#1B3A7A",
    opacity: 0.04,
    transform: [{ translateX: 29 }, { translateY: -29 }],
  },
  memberIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF0F8",
  },
  memberTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D1B3E",
    marginBottom: 4,
    fontFamily: SANS,
  },
  memberDescription: {
    fontSize: 11,
    color: "#7B7464",
    lineHeight: 18,
    fontFamily: SANS,
  },
  // Leader Card Styles
  leaderCard: {
    backgroundColor: "#0D1B3E",
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#0D1B3E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  leaderDecor: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E8C77A",
    opacity: 0.1,
    transform: [{ translateX: 29 }, { translateY: -29 }],
  },
  leaderIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(232,199,122,0.15)",
  },
  leaderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
    fontFamily: SANS,
  },
  leaderDescription: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 18,
    fontFamily: SANS,
  },
  // Shared Card Styles
  cardDecorCircle: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
    gap: 16,
  },
  cardTextContent: {
    flex: 1,
  },
  chevron: {
    marginTop: 4,
    flexShrink: 0,
  },
  // Sign In Section
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    paddingBottom: 24,
  },
  signInText: {
    fontSize: 12,
    color: "#B0A89A",
    fontFamily: SANS,
  },
  signInLink: {
    fontSize: 12,
    color: "#C4933A",
    fontWeight: "bold",
    fontFamily: SANS,
  },
});