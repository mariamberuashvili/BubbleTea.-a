import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface AuthUser {
  email: string;
  isAdmin: boolean;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  expires_in: string;
  email: string;
  is_admin: boolean;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    if (this.isBrowser()) {
      this.userSubject.next(this.readStoredUser());
    }
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${ environment.apiUrl }/auth/login`, { email, password })
      .pipe(
        tap((response) => this.saveSession(response))
      );
  }

register(name: string, surname: string, email: string, password: string) {
  return this.http.post(
    `${environment.apiUrl}/auth/register`,
    { name, surname, email, password }
  );
}

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');
    }
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return localStorage.getItem('accessToken');
  }

  isAdmin(): boolean {
    return this.userSubject.value?.isAdmin ?? false;
  }

  getEmail(): string | null {
    return this.userSubject.value?.email ?? null;
  }

  getName(): string | null {
    return this.userSubject.value?.name ?? null;
  }

  saveRegistrationName(name: string, surname: string) {
    if (!this.isBrowser()) return;
    const fullName = `${ name } ${ surname }`.trim();
    localStorage.setItem('authUserName', fullName);
  }

  private saveSession(response: AuthResponse) {
    if (this.isBrowser()) {
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('authUser', JSON.stringify({
        email: response.email,
        isAdmin: response.is_admin,
        name: response.name ?? this.getStoredAuthUserName() ?? undefined
      }));
    }

    this.userSubject.next({
      email: response.email,
      isAdmin: response.is_admin,
      name: response.name ?? this.getStoredAuthUserName() ?? undefined
    });
  }

  private readStoredUser(): AuthUser | null {
    if (!this.isBrowser()) {
      return null;
    }

    const stored = localStorage.getItem('authUser');
    if (!stored) {
      return null;
    }

    try {
      const user = JSON.parse(stored) as AuthUser;
      if (!user.name) {
        user.name = this.getStoredAuthUserName() ?? undefined;
      }
      return user;
    } catch {
      return null;
    }
  }

  private getStoredAuthUserName(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return localStorage.getItem('authUserName');
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}

