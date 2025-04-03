import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseSetup";
import { getPasswordStrength } from "@/utils/validatePassword";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<"Weak" | "Medium" | "Strong">("Weak");

  const loginHandler = () => {
    router.replace("login");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(getPasswordStrength(text));
  };

  const signupHandler = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Please fill out all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    if (passwordStrength !== "Strong") {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long and include:\n• 1 uppercase letter\n• 1 lowercase letter\n• 1 number\n• 1 special character (e.g. !@#$%^&*)"
      );
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/(recipes)");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
      />
      {password.length > 0 && (
        <Text style={{ marginLeft: 12, marginBottom: 8, color: passwordStrength === "Strong" ? "green" : passwordStrength === "Medium" ? "orange" : "red" }}>
          Password strength: {passwordStrength}
        </Text>
      )}

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button title="Register" onPress={signupHandler} />
      <Button title="Already Registered? Login" onPress={loginHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  input: {
    borderColor: "#552055",
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  label: {
    marginLeft: 8,
    marginTop: 12,
    fontWeight: "600",
  },
});
