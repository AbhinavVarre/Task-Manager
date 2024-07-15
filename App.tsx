import React from "react";
import { StyleSheet, View } from "react-native";
import { Provider, observer } from "mobx-react";
import authStore from "./api/AuthStore";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./Screens/Login/Welcome";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./Screens/TabScreens/Tabs";
import SignUpScreen from "./Screens/Login/SignUp";


export type LoginStackParams = {
  Welcome: undefined,
  Tabs: undefined,
  SignUp: undefined
};

const LoginStack = createStackNavigator<LoginStackParams>();

const App = () => {
  return (
    <Provider authStore={authStore}>
        <NavigationContainer>
          <LoginStack.Navigator initialRouteName="Welcome">
            <LoginStack.Screen name="Welcome" component={WelcomeScreen} />
            <LoginStack.Screen name="SignUp" component={SignUpScreen} />
            <LoginStack.Screen name="Tabs" component={Tabs} />
          </LoginStack.Navigator>
        </NavigationContainer>
    </Provider>
  );
};



export default App;
