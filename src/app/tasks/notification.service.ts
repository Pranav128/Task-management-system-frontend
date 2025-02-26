import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  apiUrl = environment.apiUrl + '/notifications';

  constructor(private http: HttpClient) {}

  //fetch all notifications by a taskId
  fetchNotifications(taskId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${taskId}`);
  }

  //fetch all notifications by a taskId
  fetchNotificationsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
}
