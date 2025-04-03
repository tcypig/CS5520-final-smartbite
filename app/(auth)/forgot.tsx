import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebaseSetup";
import { router } from "expo-router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "A reset link has been sent to your email.");
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Send Reset Email" onPress={handleReset} />
      <Button title="Back to Login" onPress={() => router.replace("/(auth)/login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
});
