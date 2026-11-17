import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth';

/** Barra da área da equipe: navegação interna, quem está logado e o botão Sair. */
@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  selector: 'app-admin-layout',
  styleUrl: './layout.css',
  template: `
    <div class="faixa">
      <div class="container barra">
        <p class="rotulo"><mat-icon aria-hidden="true">badge</mat-icon>Área da equipe</p>
        <nav aria-label="Área da equipe">
          <ul class="abas">
            @for (link of links; track link.rota) {
              <li>
                <a
                  [routerLink]="link.rota"
                  routerLinkActive="ativo"
                  [routerLinkActiveOptions]="{ exact: link.exato }"
                  ariaCurrentWhenActive="page"
                  >{{ link.rotulo }}</a
                >
              </li>
            }
          </ul>
        </nav>
        <div class="usuario">
          <span class="nome">{{ auth.usuario()?.nome }}</span>
          <button matButton type="button" (click)="sair()">
            <mat-icon aria-hidden="true">logout</mat-icon>Sair
          </button>
        </div>
      </div>
    </div>
    <router-outlet />
  `,
})
export class AdminLayoutComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly avisos = inject(MatSnackBar);

  protected readonly links = [
    { rota: '/admin', rotulo: 'Painel', exato: true },
    { rota: '/admin/cientistas', rotulo: 'Cientistas', exato: false },
    { rota: '/admin/sugestoes', rotulo: 'Sugestões', exato: false },
  ];

  protected sair(): void {
    this.auth.sair().subscribe({
      complete: () => this.voltarAoLogin(),
      error: () => this.voltarAoLogin(),
    });
  }

  private voltarAoLogin(): void {
    this.router.navigate(['/admin/entrar']);
    this.avisos.open('Você saiu da área da equipe.', 'Fechar', { duration: 4000 });
  }
}
