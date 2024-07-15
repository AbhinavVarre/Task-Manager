import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LeaderBoard from "./LeaderBoard/LeaderBoard";
import Profile from "./Profile/Profile";
import TaskManager from "./TaskManager/TaskManager";
import { Icon } from "react-native-elements";

export type TabsParams = {
  LeaderBoard: undefined;
  Profile: undefined;
  TaskManager: undefined;
};

//TODO: would be nice to figure out how to get mobX inject to play nice with TS when navigating
const TabBar = createBottomTabNavigator<TabsParams>();

const Tabs = () => {
  return (
    <TabBar.Navigator
      screenOptions={{ headerShown: false, tabBarActiveTintColor: "black" }}
    >
      <TabBar.Screen
        name="TaskManager"
        // @ts-ignore
        component={TaskManager}
        options={{
          tabBarIcon: ({ size, focused }) => (
            <Icon
              name="task-alt"
              type="material"
              size={size}
              color={focused ? "black" : "gray"}
            />
          ),
          title: "Tasks",
        }}
      />
      <TabBar.Screen
        name="LeaderBoard"
        component={LeaderBoard}
        options={{
          tabBarIcon: ({ size, focused }) => (
            <Icon
              name="leaderboard"
              type="material"
              size={size}
              color={focused ? "black" : "gray"}
            />
          ),
          title: "Leaderboard",
        }}
      />
      {/* @ts-ignore */}
      <TabBar.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ size, focused }) => (
            <Icon
              name="person"
              type="material"
              size={size}
              color={focused ? "black" : "gray"}
            />
          ),
          title: "Profile",
        }}
      />
    </TabBar.Navigator>
  );
};

export default Tabs;
