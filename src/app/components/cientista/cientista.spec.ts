import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cientista } from './cientista';

describe('Cientista', () => {
  let component: Cientista;
  let fixture: ComponentFixture<Cientista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cientista],
    }).compileComponents();

    fixture = TestBed.createComponent(Cientista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
