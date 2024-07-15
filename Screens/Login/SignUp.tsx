import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { StackNavigationProp } from '@react-navigation/stack';
import { LoginStackParams } from '../../App';
import { RouteProp } from '@react-navigation/native';
import authStoreInstance from "../../api/AuthStore";

type SignUpScreenNavigationProp = StackNavigationProp<LoginStackParams, 'SignUp'>;
type SignUpScreenRouteProp = RouteProp<LoginStackParams, 'SignUp'>;

interface Props {
  authStore?: typeof authStoreInstance;
  navigation: SignUpScreenNavigationProp;
  route: SignUpScreenRouteProp;
}

const SignUpScreen: React.FC<Props> = inject('authStore')(observer(({ authStore, navigation }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignUp = async () => {
    if (authStore) {
      await authStore.signUp(email, password, firstName, lastName);
      if (authStore.user) {
        navigation.navigate('Tabs');
      }
    }
  };

  return (
    <View style={styles.container}>
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
      <Text style={styles.signInText} onPress={() => navigation.navigate('Welcome')}>
        Already have an account? Sign In
      </Text>
    </View>
  );
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  signInText: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
});

export default SignUpScreen;
