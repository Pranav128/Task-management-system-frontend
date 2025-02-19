import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user';
import { UserServiceService } from '../../services/user-service.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,DatePipe,CommonModule,NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  isEditMode: boolean = false;
  profileForm!: FormGroup;
  avatars: string[] = [];
  selectedAvatar: string | null = null;
  user: User = {
    id: 0,
    username: '',
    email: '',
    gender:'',
    dob:'',
    avatar: 'assets/avatars/default-avatar.jpg' // Default avatar
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {} 
  
  ngOnInit(): void {
    const userId:string = this.authService.getLoggedUser();// Get user ID from route
    
    this.fetchUserData(userId);
    
    // Load predefined avatars
    this.avatars = [
      'assets/avatars/avatar1.jpg',
      'assets/avatars/avatar2.jpg',
      'assets/avatars/avatar3.jpg',
      'assets/avatars/avatar4.jpg',
      'assets/avatars/avatar5.jpg',
      'assets/avatars/avatar6.jpg'
    ];

    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      currentPassword: ['', Validators.minLength(6)],
      newPassword: ['', [ Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  fetchUserData(userId: string): void {
    this.userService.getUserById(userId).subscribe(
      (user) => {
        console.log(user);        
        this.user = user;
        console.log(user);
        this.selectedAvatar = user.avatar;
        console.log(this.selectedAvatar);
        this.profileForm.patchValue({
          email: user.email
        });
      },
      (error) => {
        console.error('Failed to fetch user data:', error);
      }
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
        email: this.user.email
      });
      this.selectedAvatar = null;
    }
  }

  // Handle form submission
  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const userId = this.authService.getLoggedUser();
  
    // Update email
    this.user.email = this.profileForm.value.email;

    // Upload avatar if a file is selected
    if (this.selectedAvatar) {
      this.userService.updateAvatar(userId, this.selectedAvatar).subscribe(
        (user) => {
          this.user = user;
          this.selectedAvatar = user.avatar;
          console.log('Avatar updated:', user);
        },
        (error) => {
          console.error('Failed to update avatar:', error);
        }
      );
    }
    
    // Add logic to update password (if needed)
    console.log('Profile updated:', this.user);

    // Switch back to view mode
    this.toggleEditMode();
  }

  selectAvatar(avatarUrl: string): void {
    this.selectedAvatar = avatarUrl;
  }
}
