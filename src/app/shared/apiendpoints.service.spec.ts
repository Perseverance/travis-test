import { TestBed, inject } from '@angular/core/testing';

import { APIEndpointsService } from './apiendpoints.service';

describe('APIEndpointsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [APIEndpointsService]
    });
  });

  it('should be created', inject([APIEndpointsService], (service: APIEndpointsService) => {
    expect(service).toBeTruthy();
  }));
});
