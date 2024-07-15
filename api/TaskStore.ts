import { makeAutoObservable, runInAction } from "mobx";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { firestore } from "./firebaseConfig";
import { Task, TaskToCreate, TaskToUpdate } from "./types";
import { User as FullUser, LeaderBoardUser } from "./types";

class TaskStore {
  tasks: Task[] = [];
  leaderBoard: LeaderBoardUser[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setTasks(tasks: Task[]) {
    this.tasks = tasks;
  }

  loadTasks(userId: string) {
    if (!userId) return;

    const q = query(
      collection(firestore, "tasks"),
      where("userId", "==", userId)
    );
    onSnapshot(q, (querySnapshot) => {
      const tasksList: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksList.push({ id: doc.id, ...doc.data() } as Task);
      });
      runInAction(() => {
        this.setTasks(tasksList);
      });
    });
    this.updateLeaderBoard();
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
      const existingTaskData = {
        id: taskDocSnapshot.id,
        ...taskDocSnapshot.data(),
      } as Task;
      const taskToUpdate = { ...existingTaskData };
      //   TODO: maybe loop through keys to make more maintainable
      if (updatedTask.title && updatedTask.title !== existingTaskData.title) {
        taskToUpdate.title = updatedTask.title;
      }
      if (
        updatedTask.description &&
        updatedTask.description !== existingTaskData.description
      ) {
        taskToUpdate.description = updatedTask.description;
      }
      if (
        updatedTask.completed !== undefined &&
        updatedTask.completed !== existingTaskData.completed
      ) {
        taskToUpdate.completed = updatedTask.completed;
        this.incrementTasksCompleted(existingTaskData.userId, updatedTask.completed ? 1 : -1);
      }

      await updateDoc(taskDocRef, taskToUpdate);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  private async incrementTasksCompleted(userId: string, increment: number) {
    try {
      const userDocRef = doc(firestore, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);
      const existingUserData = {
        id: userDocSnapshot.id,
        ...userDocSnapshot.data(),
      } as FullUser;
      const userToUpdate = {
        ...existingUserData,
        tasksCompleted: existingUserData.tasksCompleted + increment,
      };
      await updateDoc(userDocRef, userToUpdate);
      this.updateLeaderBoard();
    } catch (error) {
      console.error("Error incrementing tasks completed:", error);
    }
  }

  private async updateLeaderBoard() {
    try {
      const q = query(collection(firestore, "users"), orderBy("tasksCompleted", "desc"));
      const querySnapshot = await getDocs(q);
      const leaderBoardList: LeaderBoardUser[] = [];
      querySnapshot.forEach((doc) => {
        leaderBoardList.push({ firstName: doc.data().firstName, lastName: doc.data().lastName, tasksCompleted: doc.data().tasksCompleted } as LeaderBoardUser);
      });
      runInAction(() => {
        this.leaderBoard = leaderBoardList;
      });
    } catch (error) {
      console.error("Error updating leader board:", error);
    }
  }

  async deleteTask(id: string) {
    try {
      const taskDocRef = doc(firestore, "tasks", id);
      const taskDocSnapshot = await getDoc(taskDocRef);
      const task = {
        id: taskDocSnapshot.id,
        ...taskDocSnapshot.data(),
      } as Task;
      await deleteDoc(taskDocRef);
      this.incrementTasksCompleted(task.userId, -1);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
}

const taskStore = new TaskStore();
export default taskStore;
