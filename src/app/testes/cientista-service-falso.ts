import { of } from 'rxjs';
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
