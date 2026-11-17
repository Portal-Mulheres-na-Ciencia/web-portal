import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';

export interface DadosConfirmacao {
  titulo: string;
  mensagem: string;
  /** Texto do botão que confirma, por exemplo "Excluir". */
  confirmar: string;
}

/** Janela de confirmação para ações que não podem ser desfeitas. */
@Component({
  imports: [MatButtonModule, MatDialogModule],
  selector: 'app-confirmacao',
  template: `
    <h2 mat-dialog-title>{{ dados.titulo }}</h2>
    <mat-dialog-content>
      <p>{{ dados.mensagem }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton type="button" mat-dialog-close>Cancelar</button>
      <button matButton="filled" type="button" [mat-dialog-close]="true">{{ dados.confirmar }}</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmacaoComponent {
  protected readonly dados = inject<DadosConfirmacao>(MAT_DIALOG_DATA);
}

/** Abre a confirmação e devolve `true` só se a pessoa confirmar. */
export function confirmar(dialog: MatDialog, dados: DadosConfirmacao): Observable<boolean> {
  return dialog
    .open(ConfirmacaoComponent, { data: dados, width: '28rem', maxWidth: 'calc(100vw - 2rem)' })
    .afterClosed()
    .pipe(map((resposta) => resposta === true));
}
