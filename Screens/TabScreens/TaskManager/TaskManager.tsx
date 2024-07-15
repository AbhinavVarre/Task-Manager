import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { inject, observer } from "mobx-react";
import authStoreInstance from "../../../api/AuthStore";
import taskStoreInstance from "../../../api/TaskStore";
import { TabsParams } from "../Tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Task, TaskToCreate } from "../../../api/types";
import TaskComponent from "./TaskComponent";

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
    const [description, setDescription] = useState("");
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
      if (authStore.user) {
        setUserId(authStore.user.uid);
        taskStore.loadTasks(authStore.user.uid);
      }
    }, []);

    const handleAddTask = async () => {
      if (userId) {
        const newTask: TaskToCreate = {
          title,
          description,
          completed: false,
          userId: userId,
        };
        await taskStore.addTask(newTask);
        setTitle("");
        setDescription("");
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
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.header}>Task Manager</Text>

          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Task Description"
            value={description}
            onChangeText={setDescription}
          />
          <Button title="Add Task" onPress={handleAddTask} />

          {taskStore.tasks.map((task) => (
            <TaskComponent
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          ))}
        </View>
      </SafeAreaView>
    );
  })
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  task: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default TaskManager;
