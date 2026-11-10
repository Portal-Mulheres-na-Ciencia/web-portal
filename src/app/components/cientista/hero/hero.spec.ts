import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CientistaService } from '../../../services/cientista';
import { firstValueFrom } from 'rxjs';
import { HeroComponent } from './hero';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    const cientista = await firstValueFrom(TestBed.inject(CientistaService).buscar(1));
    fixture.componentRef.setInput('cientista', cientista);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
