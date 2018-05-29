import { TestBed, inject } from '@angular/core/testing';

import { ImageLogicService } from './image-logic.service';

describe('ImageLogicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageLogicService]
    });
  });

  it('should be created', inject([ImageLogicService], (service: ImageLogicService) => {
    expect(service).toBeTruthy();
  }));
});
