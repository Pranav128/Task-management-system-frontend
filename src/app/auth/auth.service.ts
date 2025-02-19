import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../env/environment';
import { User } from '../models/user';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedUser!:string;
  constructor(private sessionService: SessionService,private http: HttpClient,private router:Router) {}

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable(); // Observable for components
   
  // Fetch logged-in user data
  fetchUser(username:string): Observable<User> {
    return this.http.get<User>(this.apiUrl+"/users/"+username).pipe(
      tap(user => this.userSubject.next(user)) // Store user data globally
    );
  }

  getLoggedUser():string{
    return this.loggedUser;
  }

  setLoggedUser(user:string):void{
    this.loggedUser=user;
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(user: { username: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');;
  }

  clearToken(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  setToken(token: string, rememberMe:boolean): void {
    if (rememberMe) {
      localStorage.setItem('token', token); // Persistent storage
    } else {
      sessionStorage.setItem('token', token); // Session storage
    }
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {

    // localStorage.removeItem('token'); // Clear the JWT token
    // sessionStorage.removeItem('token'); // Clear the JWT token

    this.sessionService.clearSession(); // Clear session data
    window.alert("You have been logged out.!!");

    // this.router.navigate(['/home']); // Redirect to the login page
    // this.router.navigate(['/login']); // Redirect to login page

    // const token = this.getToken();
    // if (token) {
    //   // Notify the backend to invalidate the token
    //   this.http.post('https://your-backend-api.com/logout', { token }).subscribe({
    //     next: () => {
    //       this.clearToken();
    //     },
    //     error: () => {
    //       this.clearToken();
    //     }
    //   });
    // } else {
    //   this.clearToken();
    // }
  }
}