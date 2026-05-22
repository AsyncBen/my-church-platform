import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "./navigation";

// Screens
import SplashScreen from "../screens/SplashScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RoleSelectScreen from "../screens/RoleSelectScreen";
import MemberRegisterScreen from "../screens/MemberRegisterScreen";
import LeaderRegisterScreen from "../screens/LeaderRegisterScreen";
import LeaderPendingScreen from "../screens/LeaderPendingScreen";
import GivingScreen from "../screens/GivingScreen";
import GivingHistoryScreen from "../screens/GivingHistoryScreen";
import SermonNotesScreen from "../screens/SermonNotesScreen";
import PrayerScreen from "../screens/PrayerScreen";
import MainTabs from "./MainTabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

interface Props {
  initialScreen?: keyof RootStackParamList;
}

export default function RootNavigator({ initialScreen = "Splash" }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [prayerText, setPrayerText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [likedPrayers, setLikedPrayers] = useState<number[]>([]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' }
        }}
      >
        <Stack.Screen name="Splash">
          {({ navigation }) => (
            <SplashScreen
              onFinish={() => navigation.replace("Welcome")}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Welcome">
          {({ navigation }) => (
            <WelcomeScreen
              onLogin={() => navigation.navigate("Login")}
              onRegister={() => navigation.navigate("RoleSelect")}
              onGuest={() =>
                navigation.navigate("MainTabs", { screen: "HomeTab" })
              }
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {({ navigation }) => (
            <LoginScreen
              onBack={() => navigation.goBack()}
              onLogin={(email, password) =>
                navigation.navigate("MainTabs", { screen: "HomeTab" })
              }
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Register">
          {({ navigation }) => (
            <RegisterScreen
              onBack={() => navigation.goBack()}
              onRegister={(formData) =>
                navigation.navigate("MainTabs", { screen: "HomeTab" })
              }
              onTermsPress={() => {}}
              onPrivacyPress={() => {}}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="RoleSelect">
          {({ navigation }) => (
            <RoleSelectScreen
              onBack={() => navigation.goBack()}
              onMember={() => navigation.navigate("MemberRegister")}
              onLeader={() => navigation.navigate("LeaderRegister")}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="MemberRegister">
          {({ navigation }) => (
            <MemberRegisterScreen
              onBack={() => navigation.goBack()}
              onDone={(formData, gender, ministry) =>
                navigation.navigate("MainTabs", { screen: "HomeTab" })
              }
              showPassword={showPassword}
              togglePassword={() => setShowPassword((v) => !v)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="LeaderRegister">
          {({ navigation }) => (
            <LeaderRegisterScreen
              onBack={() => navigation.goBack()}
              onDone={(formData, role) =>
                navigation.navigate("LeaderPending")
              }
              showPassword={showPassword}
              togglePassword={() => setShowPassword((v) => !v)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="LeaderPending">
          {({ navigation }) => (
            <LeaderPendingScreen
              onContinue={() =>
                navigation.navigate("MainTabs", { screen: "HomeTab" })
              }
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="MainTabs">
          {({ navigation, route }) => (
            <MainTabs
              initialScreen={route.params?.screen}
              onNavigate={(screen, params) => {
                if (
                  screen === "Giving" ||
                  screen === "GivingHistory" ||
                  screen === "SermonNotes" ||
                  screen === "Prayer"
                ) {
                  navigation.navigate(screen, params);
                }
              }}
            />
          )}
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
              noteText={noteText}
              setNoteText={setNoteText}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Prayer">
        {({ navigation }) => (
          <PrayerScreen
            prayerText={prayerText}
            setPrayerText={setPrayerText}
            isAnonymous={isAnonymous}
            setIsAnonymous={setIsAnonymous}
            liked={likedPrayers}
            setLiked={setLikedPrayers}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}