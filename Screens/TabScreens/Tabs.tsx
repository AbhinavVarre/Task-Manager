import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LeaderBoard from "./LeaderBoard/LeaderBoard";
import Profile from "./Profile/Profile";
import TaskManager from "./TaskManager/TaskManager";
import { SafeAreaView } from "react-native-safe-area-context";

export type TabsParams = {
  LeaderBoard: undefined;
  Profile: undefined;
  TaskManager: undefined;
};

//TODO: would be nice to figure out how to get mobX inject to play nice with TS when navigating
const TabBar = createBottomTabNavigator<TabsParams>();

const Tabs = () => {
  return (
    <TabBar.Navigator screenOptions={{ headerShown: false }}>
      {/* @ts-ignore */}
      <TabBar.Screen name="TaskManager" component={TaskManager} />
      <TabBar.Screen name="LeaderBoard" component={LeaderBoard} />
      {/* @ts-ignore */}
      <TabBar.Screen name="Profile" component={Profile} />
    </TabBar.Navigator>
  );
};

export default Tabs;
