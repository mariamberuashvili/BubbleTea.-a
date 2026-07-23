import { Component, inject } from '@angular/core';

import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { AsyncPipe } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ Navbar, AsyncPipe],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil {

  private cartService = inject(CartService);
  private authService = inject(AuthService);

  cart$ = this.cartService.cart$;
  user$ = this.authService.user$;

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  increase(item: any) {
    this.cartService.updateQuantity(item.id, (item.quantity ?? 1) + 1);
  }

  decrease(item: any) {
    this.cartService.updateQuantity(item.id, (item.quantity ?? 1) - 1);
  }

  getTotal(cart: any[]) {
    return cart.reduce(
      (sum, item) =>
        sum + ((item.quantity ?? 1) * (item.price ?? 0)),
      0
    );
  }
}