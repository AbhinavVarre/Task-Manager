import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import { observer, inject } from "mobx-react";
import { User } from "../../../api/types"; 
import authStoreInstance from "../../../api/AuthStore";

interface Props {
  authStore?: typeof authStoreInstance;
}

const Profile: React.FC<Props> = inject("authStore")(observer(({ authStore }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  useEffect(() => {
    if (authStore?.user) {
      authStore.loadCompleteUser(authStore.user.uid);
    }
  }, []);

  useEffect(() => {
    if (authStore?.completeUser) {
      console.log("ran")
      console.log(authStore.completeUser) 
      const user = authStore.completeUser;
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
    }
  }, [authStore?.completeUser]);


  const handleSignOut = async () => {
    if (authStore) {
      await authStore.signOut();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        editable={false} // Make it non-editable if needed
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        editable={false} // Make it non-editable if needed
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={false} // Make it non-editable if needed
      />
      <Button title="Sign Out" onPress={handleSignOut} />
    </SafeAreaView>
  );
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default Profile;
