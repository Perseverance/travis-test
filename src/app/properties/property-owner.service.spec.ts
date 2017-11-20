import { TestBed, inject } from '@angular/core/testing';

import { PropertyOwnerService } from './property-owner.service';

describe('PropertyOwnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyOwnerService]
    });
  });

  it('should be created', inject([PropertyOwnerService], (service: PropertyOwnerService) => {
    expect(service).toBeTruthy();
  }));
});
