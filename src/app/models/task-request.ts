import { CreateTaskRequest } from "./CreateTaskRequest";

export interface TaskRequest {
  createTaskRequest: CreateTaskRequest; // Matches the backend property name
  createdById: number;
  assigneeIds: number[];
  comments:string;
}