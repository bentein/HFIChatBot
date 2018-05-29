import { TestBed, inject } from '@angular/core/testing';

import { ConversationLogicService } from './conversation-logic.service';

describe('ConversationLogicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConversationLogicService]
    });
  });

  it('should be created', inject([ConversationLogicService], (service: ConversationLogicService) => {
    expect(service).toBeTruthy();
  }));
});
