import React from "react";
import { StyleSheet, View } from "react-native";
import { Provider, observer } from "mobx-react";
import authStore from "./api/AuthStore";
import taskStore from "./api/TaskStore";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./Screens/Login/Welcome";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./Screens/TabScreens/Tabs";
import SignUpScreen from "./Screens/Login/SignUp";
import Profile from "./Screens/TabScreens/Profile/Profile";

export type LoginStackParams = {
  Welcome: undefined;
  Tabs: undefined;
  SignUp: undefined;
  Profile: undefined;
};

const LoginStack = createStackNavigator<LoginStackParams>();

const App = () => {
  return (
    <Provider authStore={authStore} taskStore={taskStore}>
      <NavigationContainer>
        <LoginStack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <LoginStack.Screen name="Welcome" component={WelcomeScreen} />
          <LoginStack.Screen name="SignUp" component={SignUpScreen} />
          <LoginStack.Screen
            name="Tabs"
            component={Tabs}
            options={{ gestureEnabled: false}}
          />
          <LoginStack.Screen name="Profile" component={Profile} />
        </LoginStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
