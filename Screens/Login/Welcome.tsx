import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { inject, observer } from "mobx-react";
import authStoreInstance from "../../api/AuthStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { LoginStackParams } from "../../App";
import { RouteProp } from "@react-navigation/native";
import Toast from "react-native-toast-message";

type WelcomeScreenNavigationProp = StackNavigationProp<
  LoginStackParams,
  "Welcome"
>;
type WelcomeScreenRouteProp = RouteProp<LoginStackParams, "Welcome">;

interface Props {
  authStore?: typeof authStoreInstance;
  navigation: WelcomeScreenNavigationProp;
  route: WelcomeScreenRouteProp;
}

const WelcomeScreen: React.FC<Props> = inject("authStore")(
  observer(({ authStore, navigation }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    const handleSignIn = async () => {
      if (!email || !password) {
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
        await authStore.signIn(email, password);
        if (authStore.user) {
          navigation.navigate("Tabs");
        }
      }
    };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>Welcome to Task Manager!</Text>
            </View>
            <View>
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
              <Button title="Sign In" onPress={handleSignIn} />
            </View>
            <View style={styles.signUpContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <Text
                style={styles.signupTextButton}
                onPress={() => navigation.navigate("SignUp")}
              >
                {" "}
                Sign up
              </Text>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  })
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  welcomeTextContainer: {
    alignItems: "center",
    paddingTop: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-around",
    width: "100%",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: "100%",
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

export default WelcomeScreen;
