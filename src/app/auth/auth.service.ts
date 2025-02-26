import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../env/environment';
import { User } from '../models/user';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedUser!: string;
  dialog: any;
  constructor(
    private sessionService: SessionService,
    private http: HttpClient,
    private router: Router
  ) {}

  // private userSubject = new BehaviorSubject<{ id: number; username: string } | null>(null);
  private userSubject = new BehaviorSubject<User | null>(null);

  /** ✅ Fetch user details after login */
  fetchUserDetails(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${username}`).pipe(
      tap((user) => this.userSubject.next(user)) // Store user in memory
    );
  }

  /** ✅ Restore session if token exists */
  loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      this.http
        .get<User>('http://localhost:8080/api/users/me') // Fetch user from token
        .subscribe(
          (user) => {
            this.userSubject.next(user);
          },
          (error) => {
            console.error('Failed to restore session:', error);
            this.logout(); // Logout if token is invalid
          }
        );
    }
  }

  /** ✅ Get user as Observable */
  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  /** ✅ Get user ID directly */
  getUserId(): number | null {
    return this.userSubject.value?.id ?? null;
  }

  /** ✅ Get username directly */
  getUsername(): string | null {
    return this.userSubject.value?.username ?? null;
  }

  getLoggedUser(): string {
    return this.loggedUser;
  }

  setLoggedUser(user: string): void {
    this.loggedUser = user;
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(user: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  clearToken(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  setToken(token: string, rememberMe: boolean): void {
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

    const confirmLogout = window.confirm('Are you sure you want to log out?');

    if (confirmLogout) {
      this.userSubject.next(null);
      this.sessionService.clearSession(); // Clear session data
      window.alert('You have been logged out.');
      // Redirect to login
      this.router.navigate(['/login']);
      // this.router.navigate(['/home']); // Redirect to the login page
    }

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
