import { NgClass, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../env/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgClass, NgIf],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  baseUrl: string = environment.apiUrl + '/auth/forgot-password';
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // ✅ Email validation
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email')!;
  }

  sendResetLink() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.http.post<any>(this.baseUrl, this.email.value).subscribe({
      next: () => {
        alert('✅ Password reset link sent! Check your email.');
        this.router.navigate(['/reset-password']);
      },
      error: () => {
        alert('❌ Error: Unable to send reset link.');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
