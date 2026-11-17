import { of, throwError } from 'rxjs';
import { CientistaService } from '../services/cientista';
import { AREAS, CIENTISTAS } from '../services/dados-exemplo';

/** Mesmos dados do serviço real, mas sem latência: os testes não precisam esperar timers. */
export const cientistaServiceFalso = {
  provide: CientistaService,
  useValue: {
    buscar: (id: number) => of(CIENTISTAS.find((c) => c.id === id) ?? null),
    listar: () => of(CIENTISTAS),
    listarAreas: () => of(AREAS),
  },
};

/** Serviço que simula a API fora do ar, para testar o aviso de erro das telas. */
export const cientistaServiceForaDoAr = {
  provide: CientistaService,
  useValue: {
    buscar: () => throwError(() => new Error('API fora do ar')),
    listar: () => throwError(() => new Error('API fora do ar')),
    listarAreas: () => throwError(() => new Error('API fora do ar')),
  },
};
