import { TestBed, inject } from '@angular/core/testing';

import { MapEventsService } from './map-events.service';

describe('MapEventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapEventsService]
    });
  });

  it('should be created', inject([MapEventsService], (service: MapEventsService) => {
    expect(service).toBeTruthy();
  }));
});
