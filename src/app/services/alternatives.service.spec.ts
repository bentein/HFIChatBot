import { TestBed, inject } from '@angular/core/testing';

import { AlternativesService } from './alternatives.service';

describe('AlternativesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlternativesService]
    });
  });

  it('should be created', inject([AlternativesService], (service: AlternativesService) => {
    expect(service).toBeTruthy();
  }));
});
