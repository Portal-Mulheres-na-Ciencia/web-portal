import { Routes } from '@angular/router';
import { autenticadoGuard } from './autenticado.guard';

/** Rotas da área da equipe (/admin). São baixadas só quando alguém abre a área. */
export const ROTAS_ADMIN: Routes = [
  {
    path: 'entrar',
    title: 'Entrar na área da equipe',
    loadComponent: () => import('./entrar/entrar').then((m) => m.EntrarPage),
  },
  {
    path: '',
    canActivate: [autenticadoGuard],
    loadComponent: () => import('./layout/layout').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        title: 'Painel da equipe',
        loadComponent: () => import('./painel/painel').then((m) => m.PainelPage),
      },
      {
        path: 'cientistas',
        title: 'Gerenciar cientistas',
        loadComponent: () => import('./cientistas/cientistas').then((m) => m.AdminCientistasPage),
      },
      {
        path: 'cientistas/nova',
        title: 'Cadastrar cientista',
        loadComponent: () => import('./cientista-form/cientista-form').then((m) => m.CientistaFormPage),
      },
      {
        path: 'cientistas/:id/editar',
        title: 'Editar cientista',
        loadComponent: () => import('./cientista-form/cientista-form').then((m) => m.CientistaFormPage),
      },
      {
        path: 'sugestoes',
        title: 'Avaliar sugestões',
        loadComponent: () => import('./sugestoes/sugestoes').then((m) => m.AdminSugestoesPage),
      },
    ],
  },
];
