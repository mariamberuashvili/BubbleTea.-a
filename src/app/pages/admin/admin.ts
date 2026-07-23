import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { ApiService } from '../../services/api.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Navbar,
    CommonModule
  ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef); 

  teas: any[] = [];
  editMode = false;
  currentId: number | null = null;

  
  form = this.fb.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    temperature: [0, Validators.required], 
    stock: [true]
  });

  ngOnInit() {
    this.loadTeas();
  }

 
  loadTeas() {
    this.api.getTeas().subscribe({
      next: (data) => {
        this.teas = data as any[];
        this.cdr.detectChanges(); 
      },
      error: () => {
      }
    });
  }

 
  saveTea() {
    if (this.form.invalid) {
      return;
    }

    
    const teaData = {
      name: this.form.value.name ?? '',
      price: Number(this.form.value.price),
      temperature: Number(this.form.value.temperature), 
      stock: this.form.value.stock ?? true
    };

  
    if (this.editMode && this.currentId !== null) {
      this.api.updateTea(this.currentId, teaData).subscribe({
        next: () => {
          alert('Producto actualizado con éxito en la base de datos');
          this.loadTeas();
          this.resetForm();
        },
        error: (err) => {
          alert(err.error?.detail || 'No se pudo actualizar el producto');
        }
      });
      return;
    }

    this.api.addTea(teaData).subscribe({
      next: () => {
        alert('Producto añadido con éxito');
        this.loadTeas();
        this.resetForm();
      },
      error: (err) => {
        alert(err.error?.detail || 'No tienes permisos de administrador');
      }
    });
  }

  
  editTea(tea: any) {
    this.editMode = true;
    this.currentId = tea.id;

    this.form.patchValue({
      name: tea.name,
      price: tea.price,
      temperature: tea.temperature, 
      stock: tea.stock
    });
  }


  deleteTea(id: number) {
    const confirmDelete = confirm('¿Seguro que deseas eliminar este producto de la base de datos?');
    if (!confirmDelete) return;

    this.api.deleteTea(id).subscribe({
      next: () => {
        alert('Producto eliminado correctamente');
        this.loadTeas();
      },
      error: (err) => {
        alert(err.error?.detail || 'Error al intentar eliminar el registro.');
      }
    });
  }

  resetForm() {
    this.editMode = false;
    this.currentId = null;
    this.form.reset({
      temperature: 0,
      stock: true
    });
  }
}