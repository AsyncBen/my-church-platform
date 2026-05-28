import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Dimensions, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Tab screens
import HomeScreen from "../screens/HomeScreen";
import LiveServiceScreen from "../screens/LiveServiceScreen";
import MinistriesScreen from "../screens/MinistriesScreen";
import FeedScreen from "../screens/FeedScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Push screens
import SermonNotesScreen from "../screens/SermonNotesScreen";
import GivingScreen from "../screens/GivingScreen";
import GivingHistoryScreen from "../screens/GivingHistoryScreen";
import PrayerScreen from "../screens/PrayerScreen";

// Custom tab bar
import BottomTabBar from "../components/navigation/BottomTabBar";

import type { MainTabParamList, MainStackParamList } from "./navigation";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();
const { width: SCREEN_WIDTH } = Dimensions.get("window");

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => {
        const tabs = [
          { id: "Home", label: "Home" },
          { id: "Ministries", label: "Connect" },
          { id: "Feed", label: "Feed" },
          { id: "Profile", label: "Profile" },
        ];
        const activeTab = props.state.routes[props.state.index].name;
        return (
          <View style={styles.tabBarWrapper}>
            <View style={styles.tabBarContainer}>
              <BottomTabBar
                tabs={tabs}
                activeTab={activeTab}
                onTabPress={(tabId) => {
                  const event = props.navigation.emit({
                    type: "tabPress",
                    target: props.state.routes.find(r => r.name === tabId)?.key ?? "",
                    canPreventDefault: true,
                  });
                  if (!event.defaultPrevented) {
                    props.navigation.navigate(tabId);
                  }
                }}
                bottomInset={insets.bottom}
              />
            </View>
          </View>
        );
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Ministries" component={MinistriesScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function MainTabNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ statusBarStyle: "dark" }} />
      <Stack.Screen name="LiveService" component={LiveServiceScreen} options={{ statusBarStyle: "light" }} />
      <Stack.Screen name="SermonNotes" component={SermonNotesScreen} options={{ statusBarStyle: "dark" }} />
      <Stack.Screen name="Giving" component={GivingScreen} options={{ statusBarStyle: "dark" }} />
      <Stack.Screen name="GivingHistory" component={GivingHistoryScreen} options={{ statusBarStyle: "light" }} />
      <Stack.Screen name="Prayer" component={PrayerScreen} options={{ statusBarStyle: "dark" }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
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