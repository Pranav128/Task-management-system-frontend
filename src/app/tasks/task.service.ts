import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';
import { AuthService } from '../auth/auth.service';
import { TaskResponse } from '../models/task-response';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl + '/tasks';

  constructor(private http: HttpClient, private auth: AuthService) {}

  //get all tasks with pagintaion and sorting
  getTasks(
    page: number = 0,
    size: number = 10,
    sort: string = 'dueDate,asc'
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get<any>(this.apiUrl, { params });
  }

  //get a task with pagintaion and sorting for a particular user
  getTasksByUserId(
    page: number = 0,
    size: number = 10,
    sort: string = 'dueDate,asc',
    userId: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { params });
  }

  // Search tasks by title, priority, or status
  searchTasks(
    title: string,
    priority: string,
    status: string
  ): Observable<TaskResponse[]> {
    const params = new HttpParams()
      .set('title', title || '')
      .set('priority', priority || '')
      .set('status', status || '');

    return this.http.get<TaskResponse[]>(`${this.apiUrl}/search`, { params });
  }

  //create new task with attachements and comments
  createTask(formData: FormData): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.apiUrl, formData); // No need to set headers here either
  }

  //get task by taskId
  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  //update task
  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task);
  }

  //delete task
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  //get all attachments for a task
  getAttachments(taskId: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${taskId}/attachments`);
  }

  //download attachment by Attachment id and task id
  downloadAttachment(
    taskId: number,
    attachmentId: number
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${taskId}/attachments/${attachmentId}`,
      { responseType: 'blob' }
    );
  }

  //upload attachments
  uploadAttachments(taskId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${taskId}/attachments`, formData);
  }

  //delete attachment
  deleteAttachment(taskId: number, attachmentId: number) {
    return this.http.delete(
      `${this.apiUrl}/${taskId}/attachments/${attachmentId}`
    );
  }

  //add comment
  addComment(taskId: number, comment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${taskId}/comments`, comment);
  }
}
