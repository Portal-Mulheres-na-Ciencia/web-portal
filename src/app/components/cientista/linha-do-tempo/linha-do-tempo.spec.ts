import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinhaDoTempoComponent } from './linha-do-tempo';

describe('LinhaDoTempoComponent', () => {
  let component: LinhaDoTempoComponent;
  let fixture: ComponentFixture<LinhaDoTempoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinhaDoTempoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinhaDoTempoComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('itens', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
