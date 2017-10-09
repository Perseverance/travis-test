import { environment } from './../../environments/environment';
import { APIEndpointsService } from './../shared/apiendpoints.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AgencySuggestionsService {

	constructor(private apiEndpoints: APIEndpointsService) { }

	public get agenciesSearchURL(): string {
		const searchTerm = '?name=';
		return `${environment.apiUrl}${this.apiEndpoints.INTERNAL_ENDPOINTS.AGENCY_SUGGESTIONS}${searchTerm}`;
	}

}
