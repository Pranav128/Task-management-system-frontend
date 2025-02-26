import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    imports: [FormsModule, CommonModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  // credentials = { username: '', password: '' };
  rememberMe: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService
  ) {}

  onSubmit() {
    const loginData = { username: this.username, password: this.password };
    this.authService.login(loginData).subscribe(
      (response) => {
        // if (this.rememberMe) {
        //   this.authService.setToken(response.token, false); //use true in prod // Save to localStorage for persistence
        // } else {
        //   this.authService.setToken(response.token, false); // Save to sessionStorage for session-only
        // }
        console.log(response.token);
        this.sessionService.setSessionData('token', response.token);

        // Start the session timer
        this.sessionService.startSessionTimer();
        console.log(this.username);

        this.authService.fetchUserDetails(this.username).subscribe((user) => {
          console.log('User details fetched:', user);
        });
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login failed', error);
        window.alert(
          'Login failed!!! \nPlease enter valid username and password'
        );
        this.username = '';
        this.password = '';
        // this.router.navigate(['/error']);
      }
    );
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  closeForm() {
    // Close the form logic
  }
}
