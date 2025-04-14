import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseSetup";
import { getPasswordStrength } from "@/utils/validatePassword";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<"Weak" | "Medium" | "Strong">("Weak");

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(getPasswordStrength(text));
  };

  const loginHandler = () => {
    router.replace("login");
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
      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.subtitle}>
        Start your SmartBite journey and personalize your meal experience.
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Create password"
        value={password}
        onChangeText={handlePasswordChange}
        placeholderTextColor="#999"
      />
      {password.length > 0 && (
        <Text
          style={{
            marginLeft: 4,
            marginBottom: 8,
            color:
              passwordStrength === "Strong"
                ? "green"
                : passwordStrength === "Medium"
                ? "orange"
                : "red",
          }}
        >
          Password strength: {passwordStrength}
        </Text>
      )}

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Re-enter password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#999"
      />

      <View style={styles.buttonStack}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.pressed,
          ]}
          onPress={signupHandler}
        >
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>

        <Pressable style={styles.linkButton} onPress={loginHandler}>
          <Text style={styles.linkText}>Already Registered? Login</Text>
        </Pressable>
      </View>
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
  title: {
    fontSize: 28,
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
  label: {
    marginTop: 12,
    fontWeight: "600",
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
