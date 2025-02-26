import { NgClass, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf], // Import ReactiveFormsModule
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  resetForm: FormGroup; // Define the form group
  showPassword: boolean = false; // Toggle password visibility
  showConfirmPassword: boolean = false; // Toggle confirm password visibility

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    // Initialize the form with validators
    this.resetForm = this.fb.group(
      {
        token: ['', Validators.required], // Token is required
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
            ),
          ],
        ], // Password validations
        confirmPassword: ['', Validators.required], // Confirm password is required
      },
      { validator: this.passwordMatchValidator } // Custom validator to check if passwords match
    );
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  // Toggle password visibility
  togglePasswordVisibility(field: 'newPassword' | 'confirmPassword'): void {
    if (field === 'newPassword') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Reset password
  resetPassword(): void {
    if (this.resetForm.invalid) {
      // Mark all fields as touched to display validation errors
      this.resetForm.markAllAsTouched();
      return;
    }

    const { token, newPassword } = this.resetForm.value;

    this.http
      .post<any>(
        `http://localhost:8080/api/auth/reset-password?token=${token}`,
        newPassword
      )
      .subscribe({
        next: (response) => {
          console.log(response.response);
          alert('Password reset successful!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          alert('Invalid or expired token.');
        },
      });
  }
}
