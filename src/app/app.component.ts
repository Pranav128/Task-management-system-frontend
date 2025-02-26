import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './components/header/header.component';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'task-management-system-frontend';

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if the user is already logged in
    if (this.authService.isLoggedIn()) {
      console.log('User is already logged in');
    }

    const token = this.sessionService.getSessionData('token');
    if (!token) {
      this.router.navigate(['/home']); // Redirect to login if no session exists
    } else {
      this.sessionService.startSessionTimer(); // Start the session timer
    }
  }
}
