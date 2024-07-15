import { Timestamp } from "firebase/firestore";

export interface Task {
    id: string;
    title: string;
    completed: boolean
    userId: string;
    completedAt: Timestamp;
  }
  
  export interface TaskToCreate {
    title: string;
    completed: boolean
    userId: string;
  }
  
  export interface TaskToUpdate {
    title?: string;
    completed?: boolean
    completedAt?: Timestamp;
  }
  

  
export interface UserToCreate {
  firstName: string;
  lastName: string;
  email: string;
}

export interface User extends UserToCreate {
  id: string;
  tasksCompleted: number;
}

export interface LeaderBoardUser {
  firstName: string;
  lastName: string;
  tasksCompleted: number;
}