import { TestBed } from '@angular/core/testing';
import { CientistaService } from './cientista';

describe('Cientista', () => {
  let service: CientistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CientistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
