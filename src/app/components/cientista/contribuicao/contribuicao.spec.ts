import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Contribuicao } from './contribuicao';

describe('Contribuicao', () => {
  let component: Contribuicao;
  let fixture: ComponentFixture<Contribuicao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contribuicao],
    }).compileComponents();

    fixture = TestBed.createComponent(Contribuicao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
