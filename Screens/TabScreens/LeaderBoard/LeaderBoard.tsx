import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { inject, observer } from "mobx-react";
import taskStoreInstance from "../../../api/TaskStore";
import RNPickerSelect from "react-native-picker-select";

interface Props {
  taskStore?: typeof taskStoreInstance;
}

const LeaderBoard: React.FC<Props> = inject("taskStore")(
  observer(({ taskStore }) => {
    const [filter, setFilter] = useState("today");

    useEffect(() => {
      handleFilterChange(filter);
    }, [filter]);

    useEffect(() => {
      handleFilterChange("today");
    }, []);

    const handleFilterChange = (selectedFilter: string) => {
      const now = new Date();
      let start, end;

      switch (selectedFilter) {
        case "today":
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
        case "week":
          start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - now.getDay()
          );
          end = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + (6 - now.getDay())
          );
          break;
        case "month":
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          break;
        default:
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
      }

      taskStore?.updateLeaderBoard({ start, end });
    };

    return (
      <View style={styles.outerContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Text style={styles.header}>Leaderboard</Text>
            <RNPickerSelect
              onValueChange={(value) => setFilter(value)}
              items={[
                { label: "Today", value: "today" },
                { label: "This Week", value: "week" },
                { label: "This Month", value: "month" },
              ]}
              style={pickerSelectStyles}
              value={filter} 
            />
            {taskStore?.leaderBoardIsLoading ? (
              <ActivityIndicator
                size="large"
                color="gray"
                style={{ alignSelf: "center" }}
              />
            ) : (
              <FlatList
                data={taskStore?.leaderBoard}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.item}>
                    <Text style={styles.rank}>{index + 1}</Text>
                    <View style={styles.userInfo}>
                      <Text style={styles.name}>
                        {item.firstName} {item.lastName}
                      </Text>
                      <Text style={styles.tasks}>
                        Tasks Completed: {item.tasksCompleted}
                      </Text>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  })
);

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 16,
  },
});

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
    padding: 15,
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
