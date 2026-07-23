
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [Navbar], 
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu implements OnInit {

  private api = inject(ApiService);
  private router = inject(Router);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef); 

  teas: any[] = [];
  errorMessage = '';
  loaded = false;

  ngOnInit() {
    this.api.getTeas().subscribe({
      next: (data: any) => {
        this.teas = data;
        this.loaded = true;

      
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los tés.';
        this.loaded = true;
        
        this.cdr.detectChanges(); 
      }
    });
  }

  addToCart(tea: any) {
    if (!tea) return;

    this.cartService.addToCart({
      ...tea,
      quantity: 1
    });
  }

  getTeaId(tea: any) {
    return tea?.id ?? tea?._id;
  }

  goToProduct(tea: any) {
    const id = this.getTeaId(tea);

    if (!id) {
      return;
    }

    this.router.navigate(['/product', id]);
  }

  getTemperaturaTexto(tea: any): string {
  switch (tea?.temperature) {
    case 2: return 'Fría y Caliente';
    case 1: return 'Caliente';
    case 0: return 'Fría';
    default: return 'N/A';
  }
}
}
