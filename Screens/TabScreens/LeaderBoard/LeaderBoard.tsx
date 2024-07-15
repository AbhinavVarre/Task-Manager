import React from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList } from "react-native";
import { inject, observer } from "mobx-react";
import taskStoreInstance from "../../../api/TaskStore";

interface Props {
  taskStore?: typeof taskStoreInstance;
}

const LeaderBoard: React.FC<Props> = inject("taskStore")(observer(({ taskStore }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>LeaderBoard</Text>
      <FlatList
        data={taskStore?.leaderBoard}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.rank}>{index + 1}</Text>
            <View style={styles.userInfo}>
              <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.tasks}>Tasks Completed: {item.tasksCompleted}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tasks: {
    fontSize: 16,
  },
});

export default LeaderBoard;
