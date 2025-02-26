import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../env/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private baseUrl = environment.apiUrl + '/users';
  constructor(private http: HttpClient) {}

  //get user by UserId
  getUserById(username: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${username}`).pipe(
      map((user) => ({
        ...user,
        birthDate: user.dob ? new Date(user.dob) : null, // Convert LocalDate to Date
      }))
    );
  }

  //update user profile
  updateProfile(
    username: string | null,
    payload: { avatar: string; currentPassword: any; newPassword: any }
  ): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${username}/profile`, payload);
  }

  //get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl); // Assuming you have a users endpoint
  }
}
