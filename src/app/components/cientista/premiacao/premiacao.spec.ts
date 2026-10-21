import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Premiacao } from './premiacao';

describe('Premiacao', () => {
  let component: Premiacao;
  let fixture: ComponentFixture<Premiacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Premiacao],
    }).compileComponents();

    fixture = TestBed.createComponent(Premiacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
