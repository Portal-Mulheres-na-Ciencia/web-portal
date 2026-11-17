import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CientistaPage } from './cientista';

describe('CientistaPage', () => {
  let component: CientistaPage;
  let fixture: ComponentFixture<CientistaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CientistaPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CientistaPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 1);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
