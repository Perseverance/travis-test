import { TestBed, inject } from '@angular/core/testing';

import { MockedFeaturedPropertiesService } from './mocked-featured-properties.service';

describe('MockedFeaturedPropertiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockedFeaturedPropertiesService]
    });
  });

  it('should be created', inject([MockedFeaturedPropertiesService], (service: MockedFeaturedPropertiesService) => {
    expect(service).toBeTruthy();
  }));
});
