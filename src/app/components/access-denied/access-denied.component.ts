import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.css',
})
export class AccessDeniedComponent {
  constructor(private router: Router) {}

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
