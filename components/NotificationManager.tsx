import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getPermissionsAsync, SchedulableTriggerInputTypes, scheduleNotificationAsync } from 'expo-notifications'
import * as Notifications from 'expo-notifications';

export  async function verifyPermissions() {
    try {
      const permissionResponse = await Notifications.getPermissionsAsync();
      if (permissionResponse.granted) {
        return true;
      }

      const response = await Notifications.requestPermissionsAsync();
      console.log("Permission request result:", response);

      return response.granted;
    } catch (error) {
      console.log("Error verifying permissions:", error);
    }
  }

export async function triggerCalorieLimitNotification(calories: number, limit: number) {
  try{
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
    Alert.alert(
      "Permission not granted",
      "Please enable notifications in settings",
      [{ text: 'Okay' }]
    );
      return;
    }

    await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Calorie Limit Exceeded',
      body: `You've consumed ${Math.round(calories)} kcal today, above your ${limit} kcal goal.`,
    },
      trigger: {
        seconds: 1, 
        type: SchedulableTriggerInputTypes.TIME_INTERVAL
      },
    });
  } catch (error) {
    console.log("Error scheduling notification:", error); 
  }
}
  
