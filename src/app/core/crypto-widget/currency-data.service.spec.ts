import { TestBed, inject } from '@angular/core/testing';

import { CurrencyDataService } from './currency-data.service';

describe('CurrencyDataService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CurrencyDataService]
		});
	});

	it('should be created', inject([CurrencyDataService], (service: CurrencyDataService) => {
		expect(service).toBeTruthy();
	}));
});
