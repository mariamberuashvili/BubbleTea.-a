import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  credentials = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  login() {
  if (this.credentials.invalid) return;

  const email = this.credentials.value.email ?? '';
  const password = this.credentials.value.password ?? '';

  this.authService.login(email, password).subscribe({
    next: (response) => {

     
      if (response.is_admin) {
        this.router.navigate(['/admin']);
        return;
      }

      this.router.navigate(['/menu']);
    },
    error: (err) => {
      alert(err.error?.detail || 'Error de login');
    }
  });
}
}