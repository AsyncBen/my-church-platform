import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "./navigation";
import { useAuth } from "../context/AuthContext";

// Nested navigators
import AuthNavigator from "./AuthNavigator";
import MainTabs from "./MainTabNavigator";

// Deep screens that sit above the main tabs
import SplashScreen from "../screens/SplashScreen";
import GivingScreen from "../screens/GivingScreen";
import GivingHistoryScreen from "../screens/GivingHistoryScreen";
import SermonNotesScreen from "../screens/SermonNotesScreen";
import PrayerScreen from "../screens/PrayerScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}
      >
        {isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <>
            <Stack.Screen name="Root">
              {({ navigation, route }) =>
                isAuthenticated ? (
                  <MainTabs
                    initialScreen={route?.params?.screen}
                    onNavigate={(screen, params) => {
                      if (
                        screen === "Giving" ||
                        screen === "GivingHistory" ||
                        screen === "SermonNotes" ||
                        screen === "Prayer"
                      ) {
                        navigation.navigate(screen as any, params);
                      }
                    }}
                  />
                ) : (
                  <AuthNavigator />
                )
              }
            </Stack.Screen>

            <Stack.Screen name="Giving">
              {({ navigation }) => (
                <GivingScreen
                  onBack={() => navigation.goBack()}
                  onHistory={() => navigation.navigate("GivingHistory")}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="GivingHistory">
              {({ navigation }) => (
                <GivingHistoryScreen onBack={() => navigation.goBack()} />
              )}
            </Stack.Screen>

            <Stack.Screen name="SermonNotes">
              {({ navigation }) => (
                <SermonNotesScreen
                  onBack={() => navigation.goBack()}
                  // local state moved into the screen instead of root
                  noteText=""
                  setNoteText={() => {}}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Prayer">
              {({ navigation }) => (
                <PrayerScreen
                  prayerText=""
                  setPrayerText={() => {}}
                  isAnonymous={false}
                  setIsAnonymous={() => {}}
                  liked={[]}
                  setLiked={() => {}}
                  onBack={() => navigation.goBack()}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}