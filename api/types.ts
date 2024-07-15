export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean
    userId: string;
  }
  
  export interface TaskToCreate {
    title: string;
    description: string;
    completed: boolean
    userId: string;
  }
  
  export interface TaskToUpdate {
    title?: string;
    description?: string;
    completed?: boolean
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