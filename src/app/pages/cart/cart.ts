import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { CartService } from '../../services/cart';
import { AsyncPipe, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-cart',
    standalone: true,
   imports: [Navbar, RouterLink, AsyncPipe, DecimalPipe],
    templateUrl: './cart.html',
    styleUrls: ['./cart.css']
})
export class Cart {
    private cartService = inject(CartService);
    cart$ = this.cartService.cart$;

    getTotal(cart: any[]) {
        return cart.reduce((sum, item) => sum + ((item.quantity ?? 1) * (item.price ?? 0)), 0);
    }
}
