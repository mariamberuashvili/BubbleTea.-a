import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth';
import { CartService } from './services/cart';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {

    this.authService.user$.subscribe(user => {
    
      this.cartService.setUser(user?.email ?? null);
    });

  }
}
