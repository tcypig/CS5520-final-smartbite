import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Pressable } from "react-native";
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
      <Text style={styles.title}>🔐 Reset Your Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive a reset link.</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      <View style={styles.buttonStack}>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={handleReset}>
          <Text style={styles.buttonText}>Send Reset Email</Text>
        </Pressable>
        <Pressable style={styles.linkButton} onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.linkText}>← Back to Login</Text>
        </Pressable>
      </View>
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
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#8A4FFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F4F4F5",
    fontSize: 16,
    color: "#333",
    marginVertical: 8,
  },
  label: {
    marginTop: 12,
    fontWeight: "600",
  },
  buttonStack: {
    marginTop: 24,
    gap: 14,
  },
  button: {
    backgroundColor: "#8A4FFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    alignItems: "center",
  },
  linkText: {
    color: "#8A4FFF",
    fontWeight: "500",
  },
});
