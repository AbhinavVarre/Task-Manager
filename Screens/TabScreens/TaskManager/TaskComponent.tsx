import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Task } from "../../../api/types";

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
  const [isEditing, setIsEditing] = React.useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = React.useState<Task>(task);
  const handleEditChange = (e: string, key: string) => {
    switch (key) {
      case "title":
        setTaskBeingEdited({ ...taskBeingEdited, title: e });
        break;
      case "description":
        setTaskBeingEdited({ ...taskBeingEdited, description: e });
        break;
      default:
        break;
    }
  };
  const handleSave = () => {
    console.log("Task being edited", taskBeingEdited);
    onEdit(taskBeingEdited);
    setIsEditing(false);
  };

  return isEditing ? (
    <SafeAreaView>
      <View style={styles.taskContainer}>
        <TextInput
          style={styles.editTitle}
          placeholder={task.title}
          onChangeText={(e) => handleEditChange(e, "title")}
        />
        <TextInput
          style={styles.editDescription}
          placeholder={task.description}
          onChangeText={(e) => handleEditChange(e, "description")}
        />
        <View style={{ flexDirection: "row" }}>
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={() => setIsEditing(false)} />
        </View>
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView>
      <View style={styles.taskContainer}>
        <Text style={styles.title}>{task.title}</Text>
        <Text>{task.description}</Text>
        <Text>{task.completed ? "Completed" : "Not Completed"}</Text>
        <Button title="Edit" onPress={() => setIsEditing(true)} />
        <Button
          title={task.completed ? "Mark as Incomplete" : "Mark as Complete"}
          onPress={() => onToggleComplete(task.id, !task.completed)}
        />
        <Button title="Delete" onPress={() => onDelete(task.id)} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
  editDescription: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
});

export default TaskComponent;
