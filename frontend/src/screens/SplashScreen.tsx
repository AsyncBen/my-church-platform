import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Church</Text>
      <Text style={styles.subtitle}>
        Stay Connected. Grow Together.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E3A8A",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: "#E5E7EB",
  },
});