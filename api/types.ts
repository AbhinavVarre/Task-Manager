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
  
  export interface TaskToDelete {
    id: string;
  }
  