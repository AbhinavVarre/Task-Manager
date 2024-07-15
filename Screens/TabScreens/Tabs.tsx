import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LeaderBoard from "./LeaderBoard/LeaderBoard";
import Profile from "./Profile/Profile";
import TaskManager from "./TaskManager/TaskManager";
import { Provider } from "mobx-react";
import taskStore from "../../api/TaskStore";

const TabBar = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Provider taskStore={taskStore}>
      <TabBar.Navigator screenOptions={{ headerShown: false }}>
        <TabBar.Screen name="LeaderBoard" component={LeaderBoard} />
        <TabBar.Screen name="Profile" component={Profile} />
        <TabBar.Screen name="TaskManager" component={TaskManager} />
      </TabBar.Navigator>
    </Provider>
  );
};

export default Tabs;
