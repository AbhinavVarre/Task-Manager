import { makeAutoObservable, runInAction } from "mobx";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
  getDocs,
  writeBatch,
  increment,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "./firebaseConfig";
import { Task, TaskToCreate, TaskToUpdate } from "./types";
import { User as FullUser, LeaderBoardUser } from "./types";

class TaskStore {
  tasks: Task[] = [];
  leaderBoard: LeaderBoardUser[] = [];
  leaderBoardIsLoading: boolean = false;
  batchedUpdates: Map<string, TaskToUpdate> = new Map();
  initialTaskStates: Map<string, boolean> = new Map();
  finalTaskStates: Map<string, boolean> = new Map();
  userIncrements: Map<string, number> = new Map();
  batchTimeout: NodeJS.Timeout | null = null;
  unsubscribeLeaderBoard: () => void = () => {}; // Unsubscribe function for leaderboard listener

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
      await addDoc(collection(firestore, "tasks"), {
        ...task,
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  async updateTask(id: string, updatedTask: TaskToUpdate) {
    try {
      const taskDocRef = doc(firestore, "tasks", id);
      const taskDocSnapshot = await getDoc(taskDocRef);
      if (!taskDocSnapshot.exists()) {
        throw new Error(`Task with id ${id} does not exist.`);
      }
      const existingTaskData = {
        id: taskDocSnapshot.id,
        ...taskDocSnapshot.data(),
      } as Task;

      if (!this.initialTaskStates.has(id)) {
        this.initialTaskStates.set(id, existingTaskData.completed);
      }

      if (updatedTask.completed !== undefined) {
        this.finalTaskStates.set(id, updatedTask.completed);
        if (updatedTask.completed) {
          updatedTask.completedAt = Timestamp.now();
        }
      }

      this.batchedUpdates.set(id, updatedTask);

      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }

      this.batchTimeout = setTimeout(() => this.executeBatchedUpdates(), 1000);

      runInAction(() => {
        this.leaderBoardIsLoading = true;
      });
    } catch (error) {
      console.error("Error updating task:", error);
      runInAction(() => {
        this.leaderBoardIsLoading = false;
      });
    }
  }

  async executeBatchedUpdates() {
    const batch = writeBatch(firestore);

    this.batchedUpdates.forEach((changes, id) => {
      const taskDocRef = doc(firestore, "tasks", id);
      batch.update(taskDocRef, { ...changes });
    });

    this.finalTaskStates.forEach((completed, taskId) => {
      const initialCompleted = this.initialTaskStates.get(taskId);
      if (initialCompleted !== undefined && initialCompleted !== completed) {
        const userId = this.tasks.find((task) => task.id === taskId)?.userId;
        if (userId) {
          const incrementValue = completed ? 1 : -1;
          this.userIncrements.set(
            userId,
            (this.userIncrements.get(userId) || 0) + incrementValue
          );
        }
      }
    });

    this.userIncrements.forEach((incrementValue, userId) => {
      const userDocRef = doc(firestore, "users", userId);
      batch.update(userDocRef, {
        tasksCompleted: increment(incrementValue),
      });
    });

    try {
      await batch.commit();
      runInAction(() => {
        this.batchedUpdates.clear();
        this.initialTaskStates.clear();
        this.finalTaskStates.clear();
        this.userIncrements.clear();
        this.updateLeaderBoard();
        this.leaderBoardIsLoading = false;
      });
    } catch (error) {
      console.error("Error executing batched updates:", error);
      runInAction(() => {
        this.leaderBoardIsLoading = false;
      });
    }
  }

  updateLeaderBoard(dateRange?: { start: Date; end: Date }) {
    runInAction(() => {
      this.leaderBoardIsLoading = true;
    });

    if (this.unsubscribeLeaderBoard) {
      this.unsubscribeLeaderBoard();
    }

    try {
      let q;
      if (dateRange) {
        const { start, end } = dateRange;
        q = query(
          collection(firestore, "tasks"),
          where("completed", "==", true),
          where("completedAt", ">=", Timestamp.fromDate(start)),
          where("completedAt", "<=", Timestamp.fromDate(end)),
          orderBy("completedAt", "desc")
        );
      } else {
        q = query(
          collection(firestore, "users"),
          orderBy("tasksCompleted", "desc")
        );
      }

      this.unsubscribeLeaderBoard = onSnapshot(q, async (querySnapshot) => {
        const leaderBoardList: LeaderBoardUser[] = [];

        if (dateRange) {
          const userTaskCounts: Map<string, number> = new Map();

          querySnapshot.forEach((doc) => {
            const taskData = doc.data() as Task;
            if (taskData.userId) {
              userTaskCounts.set(
                taskData.userId,
                (userTaskCounts.get(taskData.userId) || 0) + 1
              );
            }
          });

          for (const [userId, tasksCompleted] of userTaskCounts.entries()) {
            const userDocRef = doc(firestore, "users", userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data() as FullUser;
              leaderBoardList.push({
                firstName: userData.firstName,
                lastName: userData.lastName,
                tasksCompleted,
              });
            }
          }
        } else {
          querySnapshot.forEach((doc) => {
            leaderBoardList.push({
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              tasksCompleted: doc.data().tasksCompleted,
            } as LeaderBoardUser);
          });
        }

        // Sort the leaderboard by tasksCompleted in descending order
        leaderBoardList.sort((a, b) => b.tasksCompleted - a.tasksCompleted);

        runInAction(() => {
          this.leaderBoard = leaderBoardList;
          this.leaderBoardIsLoading = false;
        });
      });
    } catch (error) {
      console.error("Error updating leader board:", error);
      runInAction(() => {
        this.leaderBoardIsLoading = false;
      });
    }
  }

  async deleteTask(id: string) {
    try {
      const taskDocRef = doc(firestore, "tasks", id);
      const taskDocSnapshot = await getDoc(taskDocRef);
      if (!taskDocSnapshot.exists()) {
        throw new Error(`Task with id ${id} does not exist.`);
      }
      const task = {
        id: taskDocSnapshot.id,
        ...taskDocSnapshot.data(),
      } as Task;
      await deleteDoc(taskDocRef);
      this.batchedUpdates.delete(task.id);
      this.userIncrements.set(
        task.userId,
        (this.userIncrements.get(task.userId) || 0) - 1
      );

      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }

      this.batchTimeout = setTimeout(() => this.executeBatchedUpdates(), 1000);

      runInAction(() => {
        this.leaderBoardIsLoading = true;
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      runInAction(() => {
        this.leaderBoardIsLoading = false;
      });
    }
  }
}

const taskStore = new TaskStore();
export default taskStore;
