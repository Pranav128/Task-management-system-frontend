import { CommentResponse } from './comment';

export interface TaskResponse {
    id?: number;
    title: string;
    description: string;
    priority:string;
    status:string;
    dueDate: string|null;
    createdById:string;
    assignees: string[];
    comments:CommentResponse[];
}
