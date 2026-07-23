import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common'; 
import { map } from 'rxjs/operators'; 
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AsyncPipe], 
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  private router = inject(Router);
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  totalItems$ = this.cartService.cart$.pipe(
    map(items => {
      if (!items) return 0;
      return items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
    })
  );

  get userEmail(): string | null {
    return this.authService.getEmail();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout() {
    this.authService.logout(); 
  }
}