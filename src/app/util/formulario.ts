import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { ErroApi } from '../core/sugestao';

/**
 * Coloca em cada campo do formulário a mensagem de erro devolvida pela API (resposta 400)
 * e devolve o texto para o aviso geral da tela.
 */
export function aplicarErrosDaApi(formulario: AbstractControl, erro: HttpErrorResponse, mensagemPadrao: string): string {
  const corpo = erro.error as ErroApi | null;
  if (erro.status !== 400 || !corpo?.campos) {
    return mensagemPadrao;
  }
  const semCampoNaTela: string[] = [];
  for (const [campo, mensagem] of Object.entries(corpo.campos)) {
    // "contribuicoes[0].titulo" (API) vira o caminho "contribuicoes.0.titulo" (formulário).
    const controle = formulario.get(campo.replace(/\[(\d+)\]/g, '.$1'));
    if (controle) {
      controle.setErrors({ servidor: mensagem });
      controle.markAsTouched();
    } else {
      semCampoNaTela.push(mensagem);
    }
  }
  return [corpo.mensagem, ...semCampoNaTela].join(' ');
}

/** Mensagem do primeiro erro de um campo, depois que a pessoa passou por ele. */
export function mensagemDeErro(controle: AbstractControl | null, seVazio = 'Preencha este campo.'): string {
  if (!controle?.touched || !controle.errors) return '';
  const erros = controle.errors;
  if (erros['servidor']) return erros['servidor'];
  if (erros['required']) return seVazio;
  if (erros['email']) return 'Informe um e-mail válido.';
  if (erros['maxlength']) return `Use no máximo ${erros['maxlength'].requiredLength} caracteres.`;
  if (erros['min'] || erros['max']) return 'Informe um ano válido.';
  if (erros['pattern']) return 'Informe um link que comece com http:// ou https://.';
  return '';
}

/** "2026-11-10" → "10/11/2026", sem converter fuso horário. */
export function formatarData(texto: string | null): string {
  if (!texto) return '';
  const [ano, mes, dia] = texto.split('-');
  return `${dia}/${mes}/${ano}`;
}
