import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContribuicaoComponent } from './contribuicao';

describe('ContribuicaoComponent', () => {
  let component: ContribuicaoComponent;
  let fixture: ComponentFixture<ContribuicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContribuicaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContribuicaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
