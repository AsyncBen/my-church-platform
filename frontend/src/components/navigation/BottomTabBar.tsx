import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { Home, Radio, Users, Rss, User } from "lucide-react-native";
import { SANS } from "../../styles/theme";

interface Tab {
  id: string;
  label: string;
  hasNotification?: boolean;
}

interface Props {
  tabs: Tab[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
  bottomInset: number;
}

const tabIcons: Record<string, React.ComponentType<{ size: number; color: string; strokeWidth?: number }>> = {
  HomeTab: Home,
  LiveTab: Radio,
  MinistriesTab: Users,
  FeedTab: Rss,
  ProfileTab: User,
};

export default function BottomTabBar({
  tabs,
  activeTab,
  onTabPress,
  bottomInset,
}: Props) {
  // Safety check
  if (!tabs || !Array.isArray(tabs)) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottomInset + 8 },
      ]}
    >
      {tabs.map((tab) => {
        const Icon = tabIcons[tab.id];
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              isActive && styles.tabButtonActive,
            ]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
          >
            {/* Active Indicator Line */}
            {isActive && <View style={styles.activeIndicator} />}
            
            {/* Live Notification Dot */}
            {tab.hasNotification && !isActive && (
              <View style={styles.notificationDot} />
            )}
            
            {/* Icon */}
            <View style={[
              styles.iconContainer,
              isActive && styles.iconContainerActive,
            ]}>
              {Icon && (
                <Icon
                  size={isActive ? 22 : 22}
                  color={isActive ? "#1B3A7A" : "#B0A89A"}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              )}
            </View>
            
            {/* Label - Only show for active tab */}
            {isActive && (
              <AnimatedLabel label={tab.label} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Animated Label Component
function AnimatedLabel({ label }: { label: string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [label, fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Text style={styles.labelActive}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 5,
    paddingHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    position: "relative",
    paddingVertical: 4,
    minHeight: 48,
    justifyContent: "center",
  },
  tabButtonActive: {
    flex: 1.2,
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    width: 20,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#1B3A7A",
  },
  notificationDot: {
    position: "absolute",
    top: 2,
    right: "30%",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    zIndex: 1,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 32,
    borderRadius: 16,
  },
  iconContainerActive: {
    backgroundColor: "#ffffff",
  },
  labelActive: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1B3A7A",
    fontFamily: SANS,
    marginTop: 2,
  },
});