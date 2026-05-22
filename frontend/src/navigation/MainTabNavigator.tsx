import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Screens
import HomeScreen from "../screens/HomeScreen";
import LiveServiceScreen from "../screens/LiveServiceScreen";
import MinistriesScreen from "../screens/MinistriesScreen";
import FeedScreen from "../screens/FeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import BottomTabBar from "../components/navigation/BottomTabBar";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Props {
  initialScreen?: string;
  onNavigate?: (screen: string, params?: any) => void;
}

export default function MainTabs({ initialScreen = "HomeTab", onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState(initialScreen);
  const insets = useSafeAreaInsets();

  const renderScreen = () => {
    switch (activeTab) {
      case "HomeTab":
        return (
          <HomeScreen
            onLive={() => setActiveTab("LiveTab")}
            onNotes={() => onNavigate?.("SermonNotes")}
            onPrayer={() => onNavigate?.("Prayer")}
            onMinistries={() => setActiveTab("MinistriesTab")}
            onGive={() => onNavigate?.("Giving")}
          />
        );
      case "LiveTab":
        return (
          <LiveServiceScreen
            onNotes={() => onNavigate?.("SermonNotes")}
            onAudio={() => {}}
            onVideo={() => {}}
            onChat={() => {}}
            onShare={() => {}}
          />
        );
      case "MinistriesTab":
        return (
          <MinistriesScreen
            onMinistryPress={(ministry) => {
              console.log("Ministry pressed:", ministry.name);
            }}
          />
        );
      case "FeedTab":
        return (
          <FeedScreen
            onNotification={() => {}}
            onComment={(item, index) => {
              console.log("Comment on:", item.title);
            }}
            onShare={(item, index) => {
              console.log("Share:", item.title);
            }}
          />
        );
      case "ProfileTab":
        return (
          <ProfileScreen
            onNotes={() => onNavigate?.("SermonNotes")}
            onGive={() => onNavigate?.("Giving")}
            onGivingHistory={() => onNavigate?.("GivingHistory")}
            onBookmarked={() => {}}
            onAccountSettings={() => {}}
            onMinistryPress={(ministry) => {
              console.log("Ministry pressed:", ministry.label);
            }}
          />
        );
      default:
        return (
          <HomeScreen
            onLive={() => setActiveTab("LiveTab")}
            onNotes={() => onNavigate?.("SermonNotes")}
            onPrayer={() => onNavigate?.("Prayer")}
            onMinistries={() => setActiveTab("MinistriesTab")}
            onGive={() => onNavigate?.("Giving")}
          />
        );
    }
  };

  const tabs = [
    { id: "HomeTab", label: "Home" },
    { id: "LiveTab", label: "Live", hasNotification: true },
    { id: "MinistriesTab", label: "Connect" },
    { id: "FeedTab", label: "Feed" },
    { id: "ProfileTab", label: "Profile" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      
      {/* Compact Floating Tab Bar */}
      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBarContainer}>
          <BottomTabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabPress={setActiveTab}
            bottomInset={insets.bottom}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F5F0",
  },
  content: {
    flex: 1,
  },
  tabBarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 4,
  },
  tabBarContainer: {
    width: SCREEN_WIDTH - 64,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    shadowColor: "#1B3A7A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "visible",
  },
});