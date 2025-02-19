import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';
import { AuthService } from '../auth/auth.service';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private apiUrl = environment.apiUrl+"/tasks";

  constructor(private http: HttpClient,private auth:AuthService) {}

  getTasks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createTask(formData: FormData): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, formData); // No need to set headers here either
  }

  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}