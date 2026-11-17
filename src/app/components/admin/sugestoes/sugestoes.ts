import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, switchMap } from 'rxjs';
import { StatusSugestao, SugestaoAdmin } from '../../../core/curadoria';
import { CuradoriaService } from '../../../services/curadoria';
import { formatarData } from '../../../util/formulario';
import { EstadoVazioComponent } from '../../compartilhado/estado-vazio/estado-vazio';
import { ErroCarregamentoComponent } from '../../compartilhado/erro-carregamento/erro-carregamento';
import { confirmar } from '../confirmacao/confirmacao';

type Filtro = StatusSugestao | 'TODAS';

/** Sugestões enviadas pelo site: a equipe cadastra a cientista ou recusa a sugestão. */
@Component({
  imports: [RouterLink, MatButtonModule, MatIconModule, EstadoVazioComponent, ErroCarregamentoComponent],
  selector: 'app-admin-sugestoes',
  styleUrl: './sugestoes.css',
  templateUrl: './sugestoes.html',
})
export class AdminSugestoesPage {
  private readonly curadoria = inject(CuradoriaService);
  private readonly dialog = inject(MatDialog);
  private readonly avisos = inject(MatSnackBar);

  protected readonly filtros: { valor: Filtro; rotulo: string }[] = [
    { valor: 'PENDENTE', rotulo: 'Pendentes' },
    { valor: 'APROVADA', rotulo: 'Aprovadas' },
    { valor: 'RECUSADA', rotulo: 'Recusadas' },
    { valor: 'TODAS', rotulo: 'Todas' },
  ];
  protected readonly situacao: Record<StatusSugestao, { texto: string; icone: string }> = {
    PENDENTE: { texto: 'Aguardando avaliação', icone: 'schedule' },
    APROVADA: { texto: 'Aprovada', icone: 'check_circle' },
    RECUSADA: { texto: 'Recusada', icone: 'block' },
  };

  protected readonly filtro = signal<Filtro>('PENDENTE');
  protected readonly sugestoes = signal<SugestaoAdmin[] | null>(null);
  protected readonly erro = signal(false);
  protected readonly formatarData = formatarData;

  constructor() {
    this.carregar();
  }

  protected escolher(filtro: Filtro): void {
    this.filtro.set(filtro);
    this.carregar();
  }

  protected recusar(sugestao: SugestaoAdmin): void {
    confirmar(this.dialog, {
      titulo: `Recusar a sugestão de ${sugestao.nomeCientista}?`,
      mensagem: 'A sugestão sai da lista de pendentes. Lembre-se de responder a quem sugeriu pelo e-mail.',
      confirmar: 'Recusar',
    })
      .pipe(
        filter(Boolean),
        switchMap(() => this.curadoria.revisarSugestao(sugestao.id, 'RECUSADA')),
      )
      .subscribe({
        next: () => {
          this.avisos.open('Sugestão recusada.', 'Fechar', { duration: 4000 });
          this.carregar();
        },
        error: () => this.avisos.open('Não foi possível recusar agora. Tente novamente.', 'Fechar', { duration: 5000 }),
      });
  }

  /** Link de e-mail já com o assunto, para responder a quem sugeriu. */
  protected linkResposta(sugestao: SugestaoAdmin): string {
    const assunto = encodeURIComponent(`Sua sugestão para o Portal Mulheres na Ciência: ${sugestao.nomeCientista}`);
    return `mailto:${sugestao.emailSugestor}?subject=${assunto}`;
  }

  private carregar(): void {
    const filtro = this.filtro();
    this.sugestoes.set(null);
    this.erro.set(false);
    this.curadoria.listarSugestoes(filtro === 'TODAS' ? undefined : filtro).subscribe({
      next: (lista) => this.sugestoes.set(lista),
      error: () => this.erro.set(true),
    });
  }
}
