import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  registerForm: FormGroup;
  submitted = false;
  errorMsg = '';
  successMsg = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  register() {
    this.submitted = true;
    this.errorMsg = '';
    this.successMsg = false;

    if (this.registerForm.invalid) return;

    const { name, surname, email, password } = this.registerForm.value;

    this.authService.register(name, surname, email, password).subscribe({
      next: () => {
        this.authService.saveRegistrationName(name, surname);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMsg = err.error?.detail || 'Error al registrar usuario';
      }
    });
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}