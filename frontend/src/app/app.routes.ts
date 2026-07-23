import { Routes } from '@angular/router';
import { adminGuard } from './guard/admin.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then(m => m.Register)
  },

  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/menu/menu').then(m => m.Menu)
  },

  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact').then(m => m.Contact)
  },

  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil').then(m => m.Perfil),
    
  },

  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product/product').then(m => m.Product)
    
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin').then(m => m.Admin),
    canActivate: [adminGuard]
  }

];