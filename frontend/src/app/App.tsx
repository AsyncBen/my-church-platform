import React, { useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, Platform } from "react-native";
import * as Notifications from 'expo-notifications';
import RootNavigator from "../navigation/RootNavigator";
import { SocketProvider } from "../context/SocketContext";
import { AuthProvider } from "../context/AuthContext";

export default function App() {
  const notificationListener = useRef<Notifications.Subscription>(null);
  const responseListener = useRef<Notifications.Subscription>(null);

  useEffect(() => {
    // Listener for notifications received while app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('[push] Notification received in foreground:', notification);
      // You can show a custom in-app alert or update UI here
    });

    // Listener for when user taps on a notification (background/killed state)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { type, id } = response.notification.request.content.data;
      console.log('[push] User tapped notification:', { type, id });
      
      // Handle navigation based on notification type
      // You can use a navigation ref or state management to navigate
      // Example:
      // switch (type) {
      //   case 'announcement':
      //     navigationRef.navigate('AnnouncementDetail', { id });
      //     break;
      //   case 'service_start':
      //     navigationRef.navigate('LiveService');
      //     break;
      //   case 'giving_confirmation':
      //     navigationRef.navigate('GivingHistory');
      //     break;
      // }
    });

    // Check if app was opened from a notification (app was killed)
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response) {
        const { type, id } = response.notification.request.content.data;
        console.log('[push] App opened from notification:', { type, id });
        // Handle deep linking here
      }
    });

    // Cleanup listeners
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SocketProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SocketProvider>
    </SafeAreaProvider>
  );
}