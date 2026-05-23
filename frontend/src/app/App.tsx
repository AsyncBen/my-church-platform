import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, Platform } from "react-native";
import RootNavigator from "../navigation/RootNavigator";
import { SocketProvider } from "../context/SocketContext";
import { AuthProvider } from "../context/AuthContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <SocketProvider>
        <AuthProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#000000"
            translucent={Platform.OS === "android"}
          />
          <RootNavigator />
        </AuthProvider>
      </SocketProvider>
    </SafeAreaProvider>
  );
}