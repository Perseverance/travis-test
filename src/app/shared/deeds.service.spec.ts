import { TestBed, inject } from '@angular/core/testing';

import { DeedsService } from './deeds.service';

describe('DeedsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeedsService]
    });
  });

  it('should be created', inject([DeedsService], (service: DeedsService) => {
    expect(service).toBeTruthy();
  }));
});
