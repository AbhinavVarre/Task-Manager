import { observer,inject } from "mobx-react";
import { View, Text } from "react-native";
import authStore from "../../../api/AuthStore";


 const Profile = inject('authStore')(observer(()  =>{
  return (
    <View >
      <Text>
        {authStore.user?.email}
      </Text>
    </View>
  );
}))

export default Profile;