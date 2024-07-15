import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { inject, observer } from "mobx-react";
import authStoreInstance from "../../../api/AuthStore";
import taskStoreInstance from "../../../api/TaskStore";
import { TabsParams } from "../Tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Task, TaskToCreate } from "../../../api/types";
import TaskComponent from "./TaskComponent";
import { Icon } from "react-native-elements";
import Toast from "react-native-toast-message";
import { FlatList } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

type TaskManagerNavigationProp = StackNavigationProp<TabsParams, "TaskManager">;
type TaskManagerRouteProp = RouteProp<TabsParams, "TaskManager">;

interface Props {
  authStore: typeof authStoreInstance;
  taskStore: typeof taskStoreInstance;
  navigation: TaskManagerNavigationProp;
  route: TaskManagerRouteProp;
}

const TaskManager: React.FC<Props> = inject(
  "authStore",
  "taskStore"
)(
  observer(({ authStore, taskStore, navigation, route }: Props) => {
    const [title, setTitle] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const bottomTabBarHeight = useBottomTabBarHeight();

    useEffect(() => {
      if (authStore.user) {
        setUserId(authStore.user.uid);
        taskStore.loadTasks(authStore.user.uid);
      }
    }, []);

    const handleAddTask = async () => {
      if (!title.trim()) {
        Toast.show({
          type: "error",
          text1: "Task title cannot be empty!",
          topOffset: 50,
          position: "top",
        });
        return;
      }

      if (userId) {
        const newTask: TaskToCreate = {
          title,
          completed: false,
          userId: userId,
        };
        setTitle("");
        await taskStore.addTask(newTask);
      }
    };

    const handleEditTask = async (task: Task) => {
      await taskStore.updateTask(task.id, task);
    };

    const handleToggleComplete = async (taskId: string, completed: boolean) => {
      await taskStore.updateTask(taskId, { completed });
    };

    const handleDeleteTask = async (taskId: string) => {
      await taskStore.deleteTask(taskId);
    };

    if (!authStore || !taskStore) {
      return (
        <View style={styles.container}>
          <Text style={styles.header}>Error: Stores not found</Text>
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.header}>Task Manager</Text>
          <View style={styles.flexRow}>
            <TextInput
              style={styles.input}
              placeholder="Add a new task!"
              value={title}
              onChangeText={setTitle}
            />
            <Icon
              name="add"
              size={30}
              type="material"
              color="black"
              onPress={handleAddTask}
            />
          </View>

          <FlatList
            data={taskStore.tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskComponent
                task={item}
                onEdit={handleEditTask}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
              />
            )}
          />
         
        </View>
      </SafeAreaView>
    );
  })
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 8,
    flex: 1,
  },
  task: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
});

export default TaskManager;
