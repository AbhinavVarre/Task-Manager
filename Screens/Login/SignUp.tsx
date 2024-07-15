import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { inject, observer } from "mobx-react";
import { StackNavigationProp } from "@react-navigation/stack";
import { LoginStackParams } from "../../App";
import { RouteProp } from "@react-navigation/native";
import authStoreInstance from "../../api/AuthStore";
import Toast from "react-native-toast-message";

type SignUpScreenNavigationProp = StackNavigationProp<
  LoginStackParams,
  "SignUp"
>;
type SignUpScreenRouteProp = RouteProp<LoginStackParams, "SignUp">;

interface Props {
  authStore?: typeof authStoreInstance;
  navigation: SignUpScreenNavigationProp;
  route: SignUpScreenRouteProp;
}

const SignUpScreen: React.FC<Props> = inject("authStore")(
  observer(({ authStore, navigation }) => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    const handleSignUp = async () => {
      if (!firstName || !lastName || !email || !password) {
        Toast.show({
          type: "error",
          text1: "All fields are required!",
        });
        return;
      }

      if (!validateEmail(email)) {
        Toast.show({
          type: "error",
          text1: "Invalid email format!",
        });
        return;
      }

      if (authStore) {
        await authStore.signUp(email, password, firstName, lastName);
        if (authStore.user) {
          navigation.navigate("Tabs");
        }
      }
    };

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.safeArea}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>Create an Account:</Text>
            </View>
            <View>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <Button title="Sign Up" onPress={handleSignUp} />
            </View>
            <View style={styles.signUpContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <Text
                style={styles.signupTextButton}
                onPress={() => navigation.navigate("Welcome")}
              >
                {" "}
                Sign in
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  })
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // Ensure the background is white
  },
  container: {
    flex: 1,
    justifyContent: "space-around",
    padding: 16,
  },
  welcomeTextContainer: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  signupTextButton: {
    textAlign: "center",
    color: "#007AFF",
  },
  signupText: {
    textAlign: "center",
  },
  signUpContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default SignUpScreen;
