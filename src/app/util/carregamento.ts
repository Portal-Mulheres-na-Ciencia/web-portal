import { WritableSignal } from '@angular/core';
import { catchError, of, OperatorFunction } from 'rxjs';

/**
 * Se a API falhar (fora do ar, sem rede), marca o erro para a tela avisar o visitante
 * e segue com um valor padrão, em vez de deixar a página carregando para sempre.
 */
export function aoFalhar<T>(erro: WritableSignal<boolean>, valorPadrao: NoInfer<T>): OperatorFunction<T, T> {
  return catchError(() => {
    erro.set(true);
    return of(valorPadrao);
  });
}
