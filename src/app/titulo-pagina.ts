import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

export const NOME_SITE = 'Portal Mulheres na Ciência';

/**
 * Dá a cada aba um título próprio ("Cientistas · Portal Mulheres na Ciência"),
 * o que ajuda leitores de tela, histórico e abas abertas.
 * Páginas com título dinâmico (o perfil) chamam `definir` depois de carregar os dados.
 */
@Injectable()
export class TituloPaginaStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.definir(this.buildTitle(snapshot));
  }

  definir(titulo?: string): void {
    this.title.setTitle(titulo ? `${titulo} · ${NOME_SITE}` : NOME_SITE);
  }
}
