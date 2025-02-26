import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-register',
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        FormsModule,
        // TODO: `HttpClientModule` should not be imported into a component directly.
        // Please refactor the code to add `provideHttpClient()` call to the provider list in the
        // application bootstrap logic and remove the `HttpClientModule` import from this component.
        HttpClientModule,
        RouterModule,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
  signupForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        dob: ['', [Validators.required]],
        gender: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Toggle password visibility
  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Handle form submission
  onSignupSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    //Handle date for backend
    const formData = this.signupForm.value;
    formData.dob = formData.dob ? formData.dob : null;

    console.log(formData.dob);

    console.log('Signup Submitted', this.signupForm.value);
    // Add your signup logic here (e.g., call an API)
    this.authService.register(this.signupForm.value).subscribe({
      next: (res) => {
        window.alert('Registration successful! Redirecting to login...');
        this.router.navigate(['/login']); // Redirect to login page
        this.signupForm.reset();
      },
      error: (err) => {
        console.log(err);
        window.alert(
          'Registration failed. ' + err.error.resp + ' Please try again!!'
        );
        this.signupForm.reset();
      },
    });
  }
}
