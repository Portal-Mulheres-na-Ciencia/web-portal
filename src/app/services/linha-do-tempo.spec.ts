import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { LinhaDoTempoService } from './linha-do-tempo';
import { cientistaServiceFalso } from '../testes/cientista-service-falso';

describe('LinhaDoTempoService', () => {
  let service: LinhaDoTempoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [cientistaServiceFalso] });
    service = TestBed.inject(LinhaDoTempoService);
  });

  it('deve unir contribuições e prêmios em ordem cronológica', async () => {
    const itens = await firstValueFrom(service.buscarDe(1));
    expect(itens.map((i) => i.ano)).toEqual([1898, 1903, 1910, 1911]);
  });
});
