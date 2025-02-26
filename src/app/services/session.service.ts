import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionTimeout: number = 2 * 60 * 1000; // 2 minutes in milliseconds
  private timer: any;

  constructor(private router: Router) {}

  // Start the session timer
  startSessionTimer(): void {
    this.resetSessionTimer(); // Reset the timer on initialization
    window.addEventListener('mousemove', this.resetSessionTimer.bind(this));
    window.addEventListener('keypress', this.resetSessionTimer.bind(this));
    window.addEventListener('click', this.resetSessionTimer.bind(this));
  }

  // Reset the session timer
  resetSessionTimer(): void {
    clearTimeout(this.timer); // Clear the existing timer
    this.timer = setTimeout(() => this.endSession(), this.sessionTimeout); // Start a new timer
  }

  // End the session
  endSession(): void {
    sessionStorage.clear(); // Clear session data
    this.router.navigate(['/session']); // Redirect to session expired page
  }

  // Set session data
  setSessionData(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  // Get session data
  getSessionData(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  // Clear session data
  clearSession(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']); // Redirect to login page
  }
}
