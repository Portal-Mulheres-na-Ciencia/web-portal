import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CientistaService } from './cientista';

describe('CientistaService', () => {
  let service: CientistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CientistaService);
  });

  it('deve buscar por id e devolver null quando não existe', async () => {
    expect((await firstValueFrom(service.buscar(1)))?.nome).toBe('Marie Curie');
    expect(await firstValueFrom(service.buscar(999))).toBeNull();
  });

  it('deve filtrar por área', async () => {
    const lista = await firstValueFrom(service.listarPorArea(5));
    expect(lista.length).toBeGreaterThan(0);
    expect(lista.every((c) => c.areas.some((a) => a.id === 5))).toBe(true);
  });

  it('deve ter datas de nascimento anteriores às de falecimento', async () => {
    const lista = await firstValueFrom(service.listar());
    for (const c of lista) {
      if (c.dataFalecimento) expect(c.dataNascimento < c.dataFalecimento).toBe(true);
    }
  });
});
