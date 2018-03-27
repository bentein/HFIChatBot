import { TestBed, inject } from '@angular/core/testing';

import { ContextmanagerService } from './contextmanager.service';

describe('ContextmanagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContextmanagerService]
    });
  });

  it('should be created', inject([ContextmanagerService], (service: ContextmanagerService) => {
    expect(service).toBeTruthy();
  }));
});
