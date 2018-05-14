import { TestBed, inject } from '@angular/core/testing';

import { RatingReviewService } from './rating-review.service';

describe('RatingReviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RatingReviewService]
    });
  });

  it('should be created', inject([RatingReviewService], (service: RatingReviewService) => {
    expect(service).toBeTruthy();
  }));
});
