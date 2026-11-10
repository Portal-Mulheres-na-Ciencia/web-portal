import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ErroApi, NovaSugestao, SugestaoCriada } from '../../core/sugestao';
import { SugestaoService } from '../../services/sugestao';

/** Formulário para o visitante sugerir uma cientista que ainda não está no portal. */
@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  selector: 'app-sugerir',
  styleUrl: './sugerir.css',
  templateUrl: './sugerir.html',
})
export class SugerirPage {
  private readonly sugestaoService = inject(SugestaoService);

  /** As mesmas regras da API, para avisar antes de enviar. */
  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    nomeCientista: ['', [Validators.required, Validators.maxLength(150)]],
    justificativa: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
    nomeSugestor: ['', [Validators.required, Validators.maxLength(100)]],
    emailSugestor: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    consentimento: [false, Validators.requiredTrue],
  });

  protected readonly enviando = signal(false);
  protected readonly enviada = signal<SugestaoCriada | null>(null);
  protected readonly erroGeral = signal('');

  private readonly tituloSucesso = viewChild<ElementRef<HTMLElement>>('tituloSucesso');

  protected enviar(): void {
    this.erroGeral.set('');
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.sugestaoService.enviar(this.formulario.getRawValue() as NovaSugestao).subscribe({
      next: (resposta) => {
        this.enviando.set(false);
        this.enviada.set(resposta);
        // Leva o foco para a confirmação, para leitores de tela anunciarem o sucesso.
        setTimeout(() => this.tituloSucesso()?.nativeElement.focus());
      },
      error: (erro: HttpErrorResponse) => {
        this.enviando.set(false);
        this.mostrarErro(erro);
      },
    });
  }

  protected novaSugestao(): void {
    this.formulario.reset();
    this.enviada.set(null);
  }

  /** Mensagem de erro de um campo, em português, para mostrar logo abaixo dele. */
  protected erroDe(campo: keyof NovaSugestao): string {
    const controle = this.formulario.controls[campo];
    if (!controle.touched || !controle.errors) return '';
    const e = controle.errors;
    if (e['servidor']) return e['servidor'];
    if (e['required']) {
      return {
        nomeCientista: 'Informe o nome da cientista.',
        justificativa: 'Conte por que ela deveria estar no portal.',
        nomeSugestor: 'Informe o seu nome.',
        emailSugestor: 'Informe o seu e-mail.',
        consentimento: 'É preciso concordar com o uso dos seus dados para responder à sugestão.',
      }[campo];
    }
    if (e['email']) return 'Informe um e-mail válido.';
    if (e['minlength']) return `Escreva pelo menos ${e['minlength'].requiredLength} caracteres.`;
    if (e['maxlength']) return `Use no máximo ${e['maxlength'].requiredLength} caracteres.`;
    return '';
  }

  private mostrarErro(erro: HttpErrorResponse): void {
    const corpo = erro.error as ErroApi | null;
    if (erro.status === 400 && corpo?.campos) {
      for (const [campo, mensagem] of Object.entries(corpo.campos)) {
        const controle = this.formulario.get(campo);
        controle?.setErrors({ servidor: mensagem });
        controle?.markAsTouched();
      }
      this.erroGeral.set(corpo.mensagem);
      return;
    }
    this.erroGeral.set('Não foi possível enviar agora. Confira sua conexão e tente novamente.');
  }
}
