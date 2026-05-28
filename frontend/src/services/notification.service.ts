import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import { API_ROUTES } from '../constants'

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert:  true,
    shouldPlaySound:  true,
    shouldSetBadge:   true,
    shouldShowBanner: true,
    shouldShowList:   true,
  }),
})

export const registerForPushNotifications = async (token: string): Promise<void> => {
  // Push notifications only work on real devices
  if (!Device.isDevice) {
    return
  }

  // Request permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    return
  }

  // Android requires a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name:             'default',
      importance:       Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor:       '#1B3A7A',
    })
  }

  // Get push token
  const pushToken = await Notifications.getExpoPushTokenAsync({
    projectId: undefined, // Expo Go doesn't need a projectId
  })

  // Save to backend
  try {
    await fetch(API_ROUTES.auth.pushToken, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ token: pushToken.data }),
    })
  } catch (err) {
    console.warn('[push] Failed to save token:', err)
  }
}