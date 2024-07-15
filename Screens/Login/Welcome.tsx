import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  SafeAreaView,
} from "react-native";
import { inject, observer } from "mobx-react";
import authStoreInstance from "../../api/AuthStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { LoginStackParams } from "../../App";
import { RouteProp } from "@react-navigation/native";

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

    const handleSignIn = async () => {
      if (authStore) {
        await authStore.signIn(email, password);
        if (authStore.user) {
          navigation.navigate("Tabs");
        }
      }
    };

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
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
          <Text
            style={styles.signupText}
            onPress={() => navigation.navigate("SignUp")}
          >
            Don't have an account? Sign Up
          </Text>
        </View>
      </SafeAreaView>
    );
  })
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
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
  signupText: {
    marginTop: 16,
    color: "blue",
    textAlign: "center",
  },
});

export default WelcomeScreen;
