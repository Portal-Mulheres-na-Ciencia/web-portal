import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { EstadoVazioComponent } from '../estado-vazio/estado-vazio';

/** Aviso padrão quando a API não responde, com a opção de tentar de novo. */
@Component({
  imports: [MatButtonModule, EstadoVazioComponent],
  selector: 'app-erro-carregamento',
  template: `
    <app-estado-vazio
      icone="cloud_off"
      titulo="Não foi possível carregar os dados"
      mensagem="O servidor não respondeu. Confira sua conexão e tente novamente em instantes."
    >
      <button matButton="filled" type="button" (click)="recarregar()">Tentar novamente</button>
    </app-estado-vazio>
  `,
})
export class ErroCarregamentoComponent {
  protected recarregar(): void {
    location.reload();
  }
}
