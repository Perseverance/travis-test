import { TestBed, inject } from '@angular/core/testing';

import { GoogleMapsMarkersService } from './google-maps-markers.service';

describe('GoogleMapsMarkersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleMapsMarkersService]
    });
  });

  it('should be created', inject([GoogleMapsMarkersService], (service: GoogleMapsMarkersService) => {
    expect(service).toBeTruthy();
  }));
});
