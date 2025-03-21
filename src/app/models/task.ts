export interface Task {
    id?: number;
    title: string;
    description: string;
    priority:string;
    status:string;
    dueDate: string|null;
    createdById:string;
    assignees: string[];
    comments:string[];
}
