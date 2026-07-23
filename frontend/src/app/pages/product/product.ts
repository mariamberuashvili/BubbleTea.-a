import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ Navbar],
  templateUrl: './product.html',
  styleUrls: ['./product.css'],
})
export class Product implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef); 

  tea: any = null;
  loading = true;
  errorMessage = '';

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.errorMessage = 'Producto no válido';
      this.loading = false;
      return;
    }

    const id = Number(idParam);

    this.api.getTea(id).subscribe({
      next: (data) => {
        this.tea = data;
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.errorMessage = 'Error cargando producto';
        this.loading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

 addToCart() {
    if (!this.tea) return;
    this.cartService.addToCart({
      ...this.tea,
      quantity: 1
    });
  }

  getTemperaturaTexto(tea: any): string {
  switch (tea?.temperature) {
    case 2: return 'Fría y Caliente';
    case 1: return 'Caliente';
    case 0: return 'Fría';
    default: return 'N/A';
  }
}

  buyNow() {
    if (!this.tea) return;

    
    this.cartService.addToCart({
      ...this.tea,
      quantity: 1
    });
    this.router.navigate(['/perfil']);
  }}
