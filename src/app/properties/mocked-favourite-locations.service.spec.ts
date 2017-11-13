import { TestBed, inject } from '@angular/core/testing';

import { MockedFavouriteLocationsService } from './mocked-favourite-locations.service';

describe('MockedFavouriteLocationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockedFavouriteLocationsService]
    });
  });

  it('should be created', inject([MockedFavouriteLocationsService], (service: MockedFavouriteLocationsService) => {
    expect(service).toBeTruthy();
  }));
});
