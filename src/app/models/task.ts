export interface Task {
    id?: number;
    title: string;
    description: string;
    priority:string;
    status:string;
    dueDate: string|null;
    assigneeId: number;
    createdById:number;
}
