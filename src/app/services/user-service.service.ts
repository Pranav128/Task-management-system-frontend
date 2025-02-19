import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../env/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private baseUrl=environment.apiUrl+"/users";
  constructor(private http: HttpClient) {}

  getUserById(username: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${username}`).pipe(
      map(user => ({
        ...user,
        birthDate: user.dob ? new Date(user.dob) : null // Convert LocalDate to Date
      }))
    );
  }

  getAvatarUrl(username: string):  Observable<any>  {
    return this.http.get<any>(`${this.baseUrl}/${username}/avatar`);
  }
  
  updateAvatar(username: string, avtar: string): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${username}/avatar`, avtar);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl); // Assuming you have a users endpoint
  }
}
