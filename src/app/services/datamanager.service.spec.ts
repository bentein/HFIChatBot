import { TestBed, inject } from '@angular/core/testing';

import { DatamanagerService } from './datamanager.service';

describe('DatamanagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatamanagerService]
    });
  });

  it('should be created', inject([DatamanagerService], (service: DatamanagerService) => {
    expect(service).toBeTruthy();
  }));
});
