import { TestBed, inject } from '@angular/core/testing';

import { SmartContractConnectionService } from './smart-contract-connection.service';

describe('SmartContractConnectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartContractConnectionService]
    });
  });

  it('should be created', inject([SmartContractConnectionService], (service: SmartContractConnectionService) => {
    expect(service).toBeTruthy();
  }));
});
