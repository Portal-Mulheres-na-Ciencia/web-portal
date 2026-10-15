import { TestBed } from '@angular/core/testing';
import { LinhaDoTempoService } from './linha-do-tempo';

describe('LinhaDoTempo', () => {
  let service: LinhaDoTempoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinhaDoTempoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
