import { TestBed, inject } from '@angular/core/testing';

import { DataManagerService } from './datamanager.service';

describe('DatamanagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataManagerService]
    });
  });

  it('should be created', inject([DataManagerService], (service: DataManagerService) => {
    expect(service).toBeTruthy();
  }));
});
