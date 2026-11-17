import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../services/auth';
import { mensagemDeErro } from '../../../util/formulario';

/** Tela de login da área da equipe. */
@Component({
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  selector: 'app-entrar',
  styleUrl: './entrar.css',
  templateUrl: './entrar.html',
})
export class EntrarPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Página que a pessoa tentou abrir antes do login (?voltar=). */
  readonly voltar = input<string>();

  protected readonly formulario = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  protected readonly enviando = signal(false);
  protected readonly erro = signal('');

  protected entrar(): void {
    this.erro.set('');
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    const { email, senha } = this.formulario.getRawValue();
    this.auth.entrar(email, senha).subscribe({
      next: () => this.router.navigateByUrl(this.destino()),
      error: (erro: HttpErrorResponse) => {
        this.enviando.set(false);
        this.erro.set(
          erro.status === 401
            ? 'E-mail ou senha incorretos.'
            : 'Não foi possível entrar agora. Confira sua conexão e tente novamente.',
        );
      },
    });
  }

  protected erroDe(campo: 'email' | 'senha'): string {
    return mensagemDeErro(this.formulario.controls[campo], campo === 'email' ? 'Informe o seu e-mail.' : 'Informe a sua senha.');
  }

  /** Só volta para páginas da área da equipe, nunca para endereços de fora. */
  private destino(): string {
    const voltar = this.voltar();
    return voltar?.startsWith('/admin') && !voltar.startsWith('/admin/entrar') ? voltar : '/admin';
  }
}
