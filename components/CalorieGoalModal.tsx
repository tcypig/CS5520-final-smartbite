import { Alert, Button, Modal, StyleSheet, Switch, Text, TextInput, View, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { on } from 'events';
import Colors from '@/constants/styles';

interface CalorieGoalModalProps {
  visible: boolean;
  originalLimit?: number;
  originalNotificationEnabled: boolean;
  onConfirm: (limit: number, enableNotification: boolean) => void;
  onCancel: () => void;
}

export default function CalorieGoalModal({ visible, originalLimit, originalNotificationEnabled, onConfirm, onCancel }: CalorieGoalModalProps) {
  const [calorieLimit, setCalorieLimit] = useState(originalLimit ? originalLimit.toString() : '');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');
  const [enableNotification, setEnableNotification] = useState(originalNotificationEnabled);

  useEffect(() => {
    if (visible) {
      setCalorieLimit(originalLimit?.toString() || '');
    }
    console.log("Calorie Limit in modal", calorieLimit);
  }, [visible, originalLimit]);

  function calculateRecommendation() {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (!w || !h || !gender) return;

    let recommended = 0;
    if (gender === 'male') {
      recommended = 10 * w + 6.25 * h - 5 * 25 + 5;
    } else {
      recommended = 10 * w + 6.25 * h - 5 * 25 - 161;
    }
    setCalorieLimit(recommended.toFixed(0));
  }

  function handleSetGoal() {
    const limit = parseInt(calorieLimit);
    if (!limit && !enableNotification) {
      onConfirm(parseInt(calorieLimit), enableNotification);
      return;
    }

    if (!limit || isNaN(limit)) {
      Alert.alert('Invalid Input', 'Please enter or calculate a valid calorie limit.');
      return;
    }
    onConfirm(limit, enableNotification);
  }

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Set Your Calorie Limit</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter limit directly (kcal)"
            keyboardType="numeric"
            value={calorieLimit}
            onChangeText={setCalorieLimit}
          />

          <Text style={styles.subTitle}>Or calculate it below</Text>

          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
          <TextInput
            style={styles.input}
            placeholder="Gender (male / female)"
            value={gender}
            onChangeText={setGender}
          />

          <Pressable style={styles.recommendButton} onPress={calculateRecommendation}>
            <Text style={styles.recommendText}>✨ Calculate Recommended</Text>
          </Pressable>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Enable Daily Notification</Text>
            <Switch
              value={enableNotification}
              onValueChange={setEnableNotification}
              trackColor={{ false: Colors.lightGray, true: '#A5D6A7' }}
              thumbColor={enableNotification ? Colors.lightGreen : '#f4f3f4'}
            />
          </View>

          <View style={styles.buttonRow}>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" color={Colors.mediumGray} onPress={onCancel} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Confirm" color={Colors.accentBlue} onPress={handleSetGoal} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  subTitle: {
    fontSize: 14,
    color: Colors.darkGray,
    marginVertical: 8,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: Colors.lightBackground,
  },
  recommendButton: {
    backgroundColor: '#E1F5FE',
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  recommendText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0288D1',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
});