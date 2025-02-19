import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})
export class SessionComponent {
  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  goToPreviousPage() {
    window.history.back(); // Navigates to the previous page in history
  }
}
