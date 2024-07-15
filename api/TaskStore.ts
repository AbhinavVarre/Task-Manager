import { makeAutoObservable, runInAction } from 'mobx';
import { getFirestore, collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import { Task, TaskToCreate, TaskToUpdate, TaskToDelete } from './types';



class TaskStore {
  tasks: Task[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setTasks(tasks: Task[]) {
    this.tasks = tasks;
  }

  loadTasks(userId: string) {
    if (!userId) return;

    const q = query(collection(firestore, "tasks"), where("userId", "==", userId));
    onSnapshot(q, (querySnapshot) => {
      const tasksList: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksList.push({ id: doc.id, ...doc.data() } as Task);
      });
      runInAction(() => {
        this.setTasks(tasksList);
      });
    });
  }

  async addTask(task: TaskToCreate) {
    try {
      await addDoc(collection(firestore, "tasks"), task);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  async updateTask(id: string, updatedTask: TaskToUpdate) {
    try {
      const taskDocRef = doc(firestore, "tasks", id);
      const taskDocSnapshot = await getDoc(taskDocRef);
      const existingTaskData = { id: taskDocSnapshot.id, ...taskDocSnapshot.data() } as Task
      const taskToUpdate = { ...existingTaskData };
    //   TODO: maybe loop through keys to make more maintainable
        if (updatedTask.title && updatedTask.title !== existingTaskData.title) {
            taskToUpdate.title = updatedTask.title;
        }
        if (updatedTask.description && updatedTask.description !== existingTaskData.description) {
            taskToUpdate.description = updatedTask.description;
        }
        if (updatedTask.completed !== undefined && updatedTask.completed !== existingTaskData.completed) {
            taskToUpdate.completed = updatedTask.completed;
        }

      await updateDoc(taskDocRef, taskToUpdate);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  async deleteTask(id: string) {
    try {
      const taskDoc = doc(firestore, "tasks", id);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
}

const taskStore = new TaskStore();
export default taskStore;
