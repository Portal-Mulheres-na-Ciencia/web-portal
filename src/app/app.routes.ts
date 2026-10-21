import { Routes } from '@angular/router';
import { HomePage } from './components/home/home';
import { CatalogoPage } from './components/catalogo/catalogo';
import { CientistaPage } from './components/cientista/cientista';
import { NaoEncontradoPage } from './components/nao-encontrado/nao-encontrado';
import { PaletaCoresComponent } from './components/paleta-cores/paleta-cores';

export const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'cientistas',
    component: CatalogoPage
  },
  {
    path: 'cientista/:id',
    component: CientistaPage
  },
  {
    path: 'cores',
    component: PaletaCoresComponent
  },
  {
    path: '**',
    component: NaoEncontradoPage
  }
];
