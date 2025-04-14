import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { auth } from "../../firebase/firebaseSetup";
import { FirebaseError } from "firebase/app";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupHandler = () => {
    router.replace("/signup");
  };

  const skipHandler = () => {
    router.replace("/");
  };

  const loginHandler = async () => {
    if (!email || !password) {
      Alert.alert("Please fill out all fields");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/(recipes)");
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        "code" in error &&
        "message" in error
      ) {
        if (error.code === "auth/user-not-found") {
          Alert.alert("Error", "User not found");
        } else if (error.code === "auth/invalid-credential") {
          Alert.alert("Error", "Invalid credentials");
        } else {
          Alert.alert("Error", error.message);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SmartBite</Text>
      <Text style={styles.subtitle}>
        Your AI-powered recipe assistant. Discover delicious and healthy meals
        tailored for you!
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.buttonStack}>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={loginHandler}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable style={styles.linkButton} onPress={signupHandler}>
          <Text style={styles.linkText}>New User? Create An Account</Text>
        </Pressable>

        <Pressable style={styles.linkButton} onPress={() => router.push("/(auth)/forgot")}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </Pressable>

        <Pressable style={styles.skipButton} onPress={skipHandler}>
          <Text style={styles.skipText}>Skip</Text>
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
    alignItems: "center",
    paddingHorizontal: 16,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    marginLeft: 4,
    marginTop: 12,
    fontWeight: "600",
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#8A4FFF",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#555",
  },
  buttonStack: {
    marginTop: 24,
    gap: 14,
    width: "100%",
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
  skipButton: {
    alignItems: "center",
  },
  skipText: {
    color: "#aaa",
    fontWeight: "500",
  },
});
