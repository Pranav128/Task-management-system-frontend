import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css' 
})

export class LoginComponent {  
  credentials = { username: '', password: '' };
  rememberMe: boolean = false;
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router,private sessionService:SessionService) {}


  onSubmit() {
    this.authService.login(this.credentials).subscribe(
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
        
        this.authService.setLoggedUser(this.credentials.username);
        this.router.navigate(['/tasks']);
      },
      (error) => {
        console.error('Login failed', error);
        window.alert("Login failed!!! \nPlease enter valid username and password")
        this.credentials.username='';
        this.credentials.password="";
        // this.router.navigate(['/error']);
      }
    );
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  closeForm() {
    // Close the form logic
  }
}
