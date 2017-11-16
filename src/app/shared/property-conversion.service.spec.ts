import { TestBed, inject } from '@angular/core/testing';

import { PropertyConversionService } from './property-conversion.service';

describe('PropertyConversionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyConversionService]
    });
  });

  it('should be created', inject([PropertyConversionService], (service: PropertyConversionService) => {
    expect(service).toBeTruthy();
  }));
});
