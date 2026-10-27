import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PremiacaoComponent } from './premiacao';

describe('PremiacaoComponent', () => {
  let component: PremiacaoComponent;
  let fixture: ComponentFixture<PremiacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PremiacaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
