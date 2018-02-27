import { TestBed, inject } from '@angular/core/testing';

import { NotificationMessagesService } from './notification-messages.service';

describe('NotificationMessagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationMessagesService]
    });
  });

  it('should be created', inject([NotificationMessagesService], (service: NotificationMessagesService) => {
    expect(service).toBeTruthy();
  }));
});
