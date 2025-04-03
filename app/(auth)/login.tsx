// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
// import { router } from "expo-router";
// import { auth } from "../../firebase/firebaseSetup";
// import { FirebaseError } from "firebase/app";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const signupHandler = () => {
//     router.replace("signup");
//   };
//   const loginHandler = async () => {
//     if (email === "" || password === "") {
//       Alert.alert("Please fill out all fields");
//       return;
//     }
//     try {
//       const userCred = await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       if (
//         error instanceof FirebaseError &&
//         "code" in error &&
//         "message" in error
//       ) {
//         if (error.code === "auth/user-not-found") {
//           Alert.alert("Error", "User not found");
//           return;
//         } else if (error.code === "auth/invalid-credential") {
//           Alert.alert("Error", "Invalid credentials");
//           return;
//         }
//         Alert.alert("Error", error.message);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Email</Text>
//       <TextInput
//         placeholder="Email"
//         style={styles.input}
//         value={email}
//         onChangeText={(changedText) => {
//           setEmail(changedText);
//         }}
//       />
//       <Text style={styles.label}>Password</Text>
//       <TextInput
//         style={styles.input}
//         secureTextEntry={true}
//         placeholder="Password"
//         value={password}
//         onChangeText={(changedText) => {
//           setPassword(changedText);
//         }}
//       />
//       <Button title="Login" onPress={loginHandler} />
//       <Button title="New User? Create An Account" onPress={signupHandler} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "stretch",
//     justifyContent: "center",
//   },
//   input: {
//     borderColor: "#552055",
//     borderWidth: 2,
//     width: "90%",
//     margin: 5,
//     padding: 5,
//   },
//   label: {
//     marginLeft: 10,
//   },
// });

import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Redirect, router } from "expo-router";
import { auth } from "../../firebase/firebaseSetup";
import { FirebaseError } from "firebase/app";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupHandler = () => {
    router.replace("/signup");
  };

  const skipHandler = () => {
    router.replace('/'); // or router.push('/')
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
        Your AI-powered recipe assistant. Discover delicious and healthy meals tailored for you!
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

      <Button title="Login" onPress={loginHandler} />
      <Button title="New User? Create An Account" onPress={signupHandler} />
      <Button title="Forgot Password?" onPress={() => router.push("/(auth)/forgot")} color="#888" />
      <Button title="Skip" onPress={skipHandler} color="#888" />
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
      borderColor: "#552055",
      borderWidth: 2,
      borderRadius: 8,
      padding: 10,
      marginVertical: 8,
      width: "100%",         
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
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      alignSelf: "flex-start",
      marginBottom: 12,
    },
  });
  

