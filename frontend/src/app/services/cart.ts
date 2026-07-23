import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  getCartValue() {
    throw new Error('Method not implemented.');
  }

  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  private userId: string | null = null;
  private isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

  setUser(userId: string | null) {
    this.userId = userId;
    this.loadCart();
  }

  private getKey() {
    return this.userId ? `cart_${this.userId}` : 'cart_guest';
  }

  private loadCart() {
    if (!this.isBrowser()) {
      this.cartSubject.next([]);
      return;
    }

    const data = localStorage.getItem(this.getKey());
    this.cartSubject.next(data ? JSON.parse(data) : []);
  }

  private saveCart(cart: any[]) {
    localStorage.setItem(this.getKey(), JSON.stringify(cart));
  }

  addToCart(product: any) {
    const cart = [...this.cartSubject.value];

    const item = cart.find(p => p.id === product.id);

    if (item) {
      item.quantity = (item.quantity ?? 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    this.cartSubject.next(cart);
    this.saveCart(cart);
  }

  removeFromCart(id: number) {
    const cart = this.cartSubject.value.filter(p => p.id !== id);
    this.cartSubject.next(cart);
    this.saveCart(cart);
  }

  updateQuantity(id: number, quantity: number) {
    const cart = this.cartSubject.value
      .map(p => p.id === id ? { ...p, quantity } : p)
      .filter(p => p.quantity > 0);

    this.cartSubject.next(cart);
    this.saveCart(cart);
  }

  clearCart() {
    this.cartSubject.next([]);
    this.saveCart([]);
  }
}