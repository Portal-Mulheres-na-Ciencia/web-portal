import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, switchMap } from 'rxjs';
import { Cientista } from '../../../core/cientista';
import { CientistaService } from '../../../services/cientista';
import { CuradoriaService } from '../../../services/curadoria';
import { juntarInfo, normalizarTexto } from '../../../util/cientista';
import { EstadoVazioComponent } from '../../compartilhado/estado-vazio/estado-vazio';
import { ErroCarregamentoComponent } from '../../compartilhado/erro-carregamento/erro-carregamento';
import { confirmar } from '../confirmacao/confirmacao';

/** Lista de cientistas com busca, edição e exclusão. */
@Component({
  imports: [
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    EstadoVazioComponent,
    ErroCarregamentoComponent,
  ],
  selector: 'app-admin-cientistas',
  styleUrl: './cientistas.css',
  templateUrl: './cientistas.html',
})
export class AdminCientistasPage {
  private readonly curadoria = inject(CuradoriaService);
  private readonly dialog = inject(MatDialog);
  private readonly avisos = inject(MatSnackBar);

  protected readonly cientistas = signal<Cientista[] | null>(null);
  protected readonly erro = signal(false);
  protected readonly busca = signal('');

  protected readonly filtradas = computed(() => {
    const termo = normalizarTexto(this.busca());
    return (this.cientistas() ?? []).filter((c) => !termo || normalizarTexto(c.nome).includes(termo));
  });

  constructor() {
    inject(CientistaService)
      .listar()
      .subscribe({
        next: (lista) => this.cientistas.set(lista),
        error: () => this.erro.set(true),
      });
  }

  /** "Física, Química · Polonesa", sem sobrar separador quando falta algum dado. */
  protected detalhe(cientista: Cientista): string {
    return juntarInfo(cientista.areas.map((a) => a.nome).join(', '), cientista.nacionalidade);
  }

  protected excluir(cientista: Cientista): void {
    confirmar(this.dialog, {
      titulo: `Excluir ${cientista.nome}?`,
      mensagem: 'A cientista, as contribuições e os prêmios dela saem do portal. Esta ação não pode ser desfeita.',
      confirmar: 'Excluir',
    })
      .pipe(
        filter(Boolean),
        switchMap(() => this.curadoria.excluirCientista(cientista.id)),
      )
      .subscribe({
        next: () => {
          this.cientistas.update((lista) => lista?.filter((c) => c.id !== cientista.id) ?? null);
          this.avisos.open(`${cientista.nome} foi excluída do portal.`, 'Fechar', { duration: 4000 });
        },
        error: () => this.avisos.open('Não foi possível excluir agora. Tente novamente.', 'Fechar', { duration: 5000 }),
      });
  }
}
