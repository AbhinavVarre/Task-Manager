import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  View,
} from "react-native";
import { observer, inject } from "mobx-react";
import authStoreInstance from "../../../api/AuthStore";
import { useNavigation } from "@react-navigation/native";

interface Props {
  authStore?: typeof authStoreInstance;
}

const Profile: React.FC<Props> = inject("authStore")(
  observer(({ authStore }) => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const navigation = useNavigation();

    useEffect(() => {
      if (authStore?.user) {
        authStore.loadCompleteUser(authStore.user.uid);
      }
    }, []);

    useEffect(() => {
      if (authStore?.completeUser) {
        const user = authStore.completeUser;
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
      }
    }, [authStore?.completeUser]);

    const handleSignOut = async () => {
      if (authStore) {
        await authStore.signOut();
        // @ts-ignore
        navigation.navigate("Welcome");
      }
    };

    return (
      <View style={styles.outerContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Text style={styles.header}>Welcome {firstName}!</Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                editable={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                editable={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                editable={false}
              />
            </View>
            <Button title="Sign Out" onPress={handleSignOut} />
          </View>
        </SafeAreaView>
      </View>
    );
  })
);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "space-around",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default Profile;
