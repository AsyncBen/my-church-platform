import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, Platform } from "react-native";
import RootNavigator from "../navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#000000"
        translucent={Platform.OS === 'android'}
      />
      <RootNavigator />
    </SafeAreaProvider>
  );
}