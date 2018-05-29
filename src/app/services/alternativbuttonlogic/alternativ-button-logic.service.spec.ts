import { TestBed, inject } from '@angular/core/testing';

import { AlternativButtonLogicService } from './alternativ-button-logic.service';

describe('AlternativButtonLogicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlternativButtonLogicService]
    });
  });

  it('should be created', inject([AlternativButtonLogicService], (service: AlternativButtonLogicService) => {
    expect(service).toBeTruthy();
  }));
});
