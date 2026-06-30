export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  assignee: string | null;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: TaskPriority;
  assignee?: string;
  dueDate: string;
  status: TaskStatus;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assignee?: string | null;
  dueDate?: string;
  status?: TaskStatus;
}

export interface TaskQueryFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
}
