export interface CreateTaskRequest{
    title: string;
    description: string;
    priority:string;
    status:string;
    dueDate: string|null;
}