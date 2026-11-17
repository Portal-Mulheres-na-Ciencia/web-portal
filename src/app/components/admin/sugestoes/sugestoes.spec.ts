import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AdminSugestoesPage } from './sugestoes';

const PENDENTE = {
  id: 5,
  nomeCientista: 'Sonia Guimarães',
  justificativa: 'Primeira mulher negra doutora em física no Brasil.',
  nomeSugestor: 'Ana',
  emailSugestor: 'ana@exemplo.com',
  dataSugestao: '2026-11-10',
  status: 'PENDENTE',
  revisor: null,
  idCientista: null,
};

describe('AdminSugestoesPage', () => {
  let fixture: ComponentFixture<AdminSugestoesPage>;
  let elemento: HTMLElement;
  let http: HttpTestingController;
  const dialogo = { open: vi.fn(() => ({ afterClosed: () => of(true) })) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSugestoesPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialog, useValue: dialogo },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSugestoesPage);
    elemento = fixture.nativeElement as HTMLElement;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('deve mostrar as pendentes com a data, quem sugeriu e o e-mail', async () => {
    http.expectOne('/api/admin/sugestoes?status=PENDENTE').flush([PENDENTE]);
    await fixture.whenStable();

    expect(elemento.textContent).toContain('Sonia Guimarães');
    expect(elemento.textContent).toContain('10/11/2026');
    expect(elemento.textContent).toContain('Aguardando avaliação');
    expect(elemento.querySelector('a[href^="mailto:ana@exemplo.com"]')).toBeTruthy();
    expect(elemento.querySelector('a[href="/admin/cientistas/nova?sugestao=5"]')).toBeTruthy();
  });

  it('deve recusar a sugestão depois de confirmar', async () => {
    http.expectOne('/api/admin/sugestoes?status=PENDENTE').flush([PENDENTE]);
    await fixture.whenStable();

    const recusar = Array.from(elemento.querySelectorAll('button')).find((b) => b.textContent?.includes('Recusar'))!;
    recusar.click();

    const requisicao = http.expectOne('/api/admin/sugestoes/5');
    expect(requisicao.request.method).toBe('PATCH');
    expect(requisicao.request.body).toEqual({ status: 'RECUSADA' });
    requisicao.flush({ ...PENDENTE, status: 'RECUSADA', revisor: 'Equipe' });

    http.expectOne('/api/admin/sugestoes?status=PENDENTE').flush([]);
    await fixture.whenStable();
    expect(elemento.textContent).toContain('Nenhuma sugestão por aqui');
  });

  it('deve trocar o filtro e buscar todas as sugestões', async () => {
    http.expectOne('/api/admin/sugestoes?status=PENDENTE').flush([]);
    await fixture.whenStable();

    const todas = Array.from(elemento.querySelectorAll<HTMLButtonElement>('.filtro')).find((b) => b.textContent?.includes('Todas'))!;
    todas.click();

    http.expectOne('/api/admin/sugestoes').flush([{ ...PENDENTE, status: 'APROVADA', idCientista: 12 }]);
    await fixture.whenStable();
    expect(todas.getAttribute('aria-pressed')).toBe('true');
    expect(elemento.textContent).toContain('Aprovada');
    expect(elemento.querySelector('a[href="/cientista/12"]')).toBeTruthy();
  });
});
