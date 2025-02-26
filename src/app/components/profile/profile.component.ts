import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user';
import { UserServiceService } from '../../services/user-service.service';

@Component({
    selector: 'app-profile',
    imports: [FormsModule, ReactiveFormsModule, DatePipe, CommonModule, NgIf],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  isEditMode: boolean = false;
  profileForm!: FormGroup;
  avatars: string[] = [];
  selectedAvatar: string | null = null;
  user$: Observable<User | null>;
  user: User = {
    id: 0,
    username: '',
    email: '',
    gender: '',
    dob: '',
    avatar: 'assets/avatars/default-avatar.jpg', // Default avatar
  };

  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private authService: AuthService
  ) {
    this.user$ = this.authService.getUser();
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.selectedAvatar = user.avatar;
      } else {
        console.warn('User is null, cannot set CreatedById');
      }
    });
    console.log('User after onInit profile: ' + this.user);

    // Load predefined avatars
    this.avatars = [
      'assets/avatars/avatar1.jpg',
      'assets/avatars/avatar2.jpg',
      'assets/avatars/avatar3.jpg',
      'assets/avatars/avatar4.jpg',
      'assets/avatars/avatar5.jpg',
      'assets/avatars/avatar6.jpg',
    ];

    // Initialize the form with validators
    this.profileForm = this.fb.group(
      {
        email: [{ value: this.user.email, disabled: true }], // Email is read-only
        currentPassword: ['', Validators.required, Validators.minLength(8)], // Current password is required
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
            ),
          ],
        ], // New password is optional
        confirmPassword: [''],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  // Toggle between view and edit modes
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.profileForm.reset({
        email: this.user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      this.selectedAvatar = null;
    }
  }

  // Handle form submission
  onSubmit(): void {
    // if (this.profileForm.invalid) {
    //   return;
    // }
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.getUserId();
    const username = this.authService.getUsername();

    // Prepare the payload
    const payload = {
      avatar: this.selectedAvatar || this.user.avatar, // Use selected avatar or keep the existing one
      currentPassword: this.profileForm.value.currentPassword,
      newPassword: this.profileForm.value.newPassword,
    };

    // Send a single request to update profile
    this.userService.updateProfile(username, payload).subscribe({
      next: (user) => {
        this.user = user;
        this.selectedAvatar = user.avatar;
        console.log('Profile updated:', this.user);
        alert('Profile updated successfully!');
        this.toggleEditMode(); // Switch back to view mode
      },
      error: (error) => {
        console.error('Failed to update profile:', error);
        alert('Failed to update profile. Please try again.');
      },
    });
  }

  selectAvatar(avatarUrl: string): void {
    this.selectedAvatar = avatarUrl;
  }

  // Toggle password visibility
  togglePasswordVisibility(
    field: 'currentPassword' | 'newPassword' | 'confirmPassword'
  ): void {
    if (field === 'currentPassword') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'newPassword') {
      this.showNewPassword = !this.showNewPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
