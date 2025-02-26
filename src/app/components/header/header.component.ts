import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-header',
    imports: [CommonModule, NgIf, RouterModule, RouterLinkActive],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
  isNavbarOpen: boolean = false;
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  constructor(private router: Router, private authService: AuthService) {}

  navigateTo(route: string) {
    console.log(`Navigating to ${route}`);
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }
}
