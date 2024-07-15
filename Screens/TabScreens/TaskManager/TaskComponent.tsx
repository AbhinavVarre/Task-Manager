import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Task } from "../../../api/types";
import { Icon } from "react-native-elements";

interface TaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
}

const TaskComponent: React.FC<TaskProps> = ({
  task,
  onEdit,
  onToggleComplete,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<Task>(task);
  const [taskCompleted, setTaskCompleted] = useState(task.completed);

  const handleEditChange = (e: string) => {
    setTaskBeingEdited({ ...taskBeingEdited, title: e });
  };

  useEffect(() => {
    setTaskCompleted(task.completed);
  }, [task.completed]);

  const handleToggleComplete = useCallback(() => {
    const newCompletedState = !taskCompleted;
    setTaskCompleted(newCompletedState);
    onToggleComplete(task.id, newCompletedState);
  }, [taskCompleted, task.id, onToggleComplete]);

  const handleSave = () => {
    console.log("Task being edited", taskBeingEdited);
    onEdit(taskBeingEdited);
    setIsEditing(false);
  };

  return isEditing ? (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.taskContainer}>
        <TextInput
          style={styles.editTitle}
          placeholder={task.title}
          onChangeText={handleEditChange}
          value={taskBeingEdited.title}
        />

        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={() => setIsEditing(false)} />
        </View>
      </View>
    </SafeAreaView>
  ) : (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.taskContainer}>
          <View style={styles.taskInfo}>
            <Icon
              name={taskCompleted ? "check-circle" : "radio-button-unchecked"}
              type="material"
              size={30}
              onPress={handleToggleComplete}
              style={styles.icon}
            />
            <Text
              style={[
                styles.title,
                { textDecorationLine: taskCompleted ? "line-through" : "none" },
              ]}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {task.title}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon
              name="edit"
              type="material"
              onPress={() => setIsEditing(true)}
              style={styles.icon}
            />
            <Icon
              name="delete"
              type="material"
              onPress={() => onDelete(task.id)}
              style={styles.icon}
            />
          </View>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  taskInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    flexWrap: "wrap",
    marginHorizontal: 10,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    backgroundColor: "#f9f9f9",
    flex: 1,
    flexWrap: "wrap",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default TaskComponent;
