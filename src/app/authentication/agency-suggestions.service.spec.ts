import { TestBed, inject } from '@angular/core/testing';

import { AgencySuggestionsService } from './agency-suggestions.service';

describe('AgencySuggestionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgencySuggestionsService]
    });
  });

  it('should be created', inject([AgencySuggestionsService], (service: AgencySuggestionsService) => {
    expect(service).toBeTruthy();
  }));
});
