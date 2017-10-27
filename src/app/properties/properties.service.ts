import { environment } from './../../environments/environment';
import { APIEndpointsService } from './../shared/apiendpoints.service';
import { RestClientService } from './../shared/rest-client.service';
import { Injectable } from '@angular/core';
import {
	GetPropertiesResponse,
	PropertyAgentResponse,
	GetFavouriteLocationResponse,
	CreatePropertyRequest,
	CreatePropertyResponse,
	PropertyImage, GetNewPropertiesResponse, NewPropertyHome
} from './properties-responses';
import { LocalStorageService } from '../shared/localStorage.service';

interface Bounds {
	southWestLatitude: number,
	northEastLatitude: number,
	southWestLongitude: number,
	northEastLongitude: number
}

@Injectable()
export class PropertiesService {

	constructor(private restService: RestClientService,
		private apiEndpoint: APIEndpointsService,
		private localStorageService: LocalStorageService) {
	}

	public async getProperty(propertyId: string): Promise<any> {
		const params = {
			id: propertyId
		};
		const result = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.SINGLE_PROPERTY, { params });
		// TODO : Remove this once Vankata adds addedOnTimestamp in the backend
		result.data.data.addedOnTimestamp = 1456263980;
		return result.data.data;
	}

	public async getPropertiesInRectangle(southWestLatitude: number,
		northEastLatitude: number,
		southWestLongitude: number,
		northEastLongitude: number): Promise<GetPropertiesResponse> {
		const bounds: Bounds = this.createRectangleBounds(southWestLatitude,
			northEastLatitude,
			southWestLongitude,
			northEastLongitude);
		const query = this.propertiesInRectangleQueryFormat(bounds);
		const params = {
			search: query
		};

		const result = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.PROPERTIES_BY_RECTANGLE, { params });
		return { properties: result.data.data.properties };
	}

	private createRectangleBounds(southWestLatitude: number,
		northEastLatitude: number,
		southWestLongitude: number,
		northEastLongitude: number) {
		const bounds: Bounds = {
			southWestLatitude: southWestLatitude,
			northEastLatitude: northEastLatitude,
			southWestLongitude: southWestLongitude,
			northEastLongitude: northEastLongitude
		};
		return bounds;
	}

	private propertiesInRectangleQueryFormat(bounds: Bounds) {
		const querySuffix = '_coords/1,25_page/';
		const query = `/${bounds.southWestLatitude},${bounds.northEastLatitude},${bounds.southWestLongitude},${bounds.northEastLongitude}${querySuffix}`;
		return query;
	}

	public async getFavouriteLocations(): Promise<GetFavouriteLocationResponse[]> {
		const queryParams = {
			currency: this.localStorageService.selectedCurrencyType
		};
		const result = await this.restService.get(this.apiEndpoint.INTERNAL_ENDPOINTS.FAVOURITE_LOCATIONS, { params: queryParams });
		return result.data.data;
	}

	public async getNewProperties(): Promise<GetNewPropertiesResponse[]> {
		const queryParams = {
			currency: this.localStorageService.selectedCurrencyType
		};
		const result = await this.restService.get(this.apiEndpoint.INTERNAL_ENDPOINTS.NEW_PROPERTIES, { params: queryParams });
		return result.data.data;
	}

	public async createProperty(data: CreatePropertyRequest): Promise<CreatePropertyResponse> {
		const result = await this.restService.postWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.CREATE_PROPERTY, data);
		return result.data;
	}

	public async uploadPropertyImages(propertyId: string, propertyImages: PropertyImage[]): Promise<boolean> {
		const queryParams = {
			id: propertyId
		};
		const result = await this.restService.postWithAccessToken(
			this.apiEndpoint.INTERNAL_ENDPOINTS.UPLOAD_IMAGES,
			propertyImages,
			{ params: queryParams });

		return true;
	}
}
