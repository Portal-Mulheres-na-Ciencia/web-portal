import { Routes } from '@angular/router';
// Cada página vira um pacote separado, baixado só quando a rota é visitada.
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then((m) => m.HomePage),
  },
  {
    path: 'cientistas',
    title: 'Cientistas',
    loadComponent: () => import('./components/catalogo/catalogo').then((m) => m.CatalogoPage),
  },
  {
    path: 'cientista/:id',
    title: 'Perfil da cientista',
    loadComponent: () => import('./components/cientista/cientista').then((m) => m.CientistaPage),
  },
  {
    path: 'cores',
    title: 'Paleta de cores',
    loadComponent: () =>
      import('./components/paleta-cores/paleta-cores').then((m) => m.PaletaCoresComponent),
  },
  {
    path: '**',
    title: 'Página não encontrada',
    loadComponent: () =>
      import('./components/nao-encontrado/nao-encontrado').then((m) => m.NaoEncontradoPage),
  },
];
