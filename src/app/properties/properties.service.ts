import {MockedFavouriteLocationsService} from './mocked-favourite-locations.service';
import {PropertiesFilter} from './properties.service';
import {environment} from './../../environments/environment';
import {APIEndpointsService} from './../shared/apiendpoints.service';
import {RestClientService} from './../shared/rest-client.service';
import {Injectable} from '@angular/core';
import {
	GetPropertiesResponse,
	PropertyAgentResponse,
	GetFavouriteLocationResponse,
	CreatePropertyRequest,
	CreatePropertyResponse,
	PropertyImage, GetNewPropertiesResponse, NewPropertyHome
} from './properties-responses';
import {LocalStorageService} from '../shared/localStorage.service';

interface Bounds {
	southWestLatitude: number;
	northEastLatitude: number;
	southWestLongitude: number;
	northEastLongitude: number;
}

export interface PropertiesFilter {
	sorting?: number;
	priceFilter?: {
		minValue: number,
		maxValue: number,
		currency: number
	};
	areaFilter?: {
		minValue: number,
		maxValue: number,
		areaUnit: number
	};
	bedFilter?: string;
}

@Injectable()
export class PropertiesService {

	constructor(private restService: RestClientService,
				private apiEndpoint: APIEndpointsService,
				private localStorageService: LocalStorageService,
				private mockedFavouriteLocationsService: MockedFavouriteLocationsService) {
	}

	public async getProperty(propertyId: string): Promise<any> {
		const params = {
			id: propertyId
		};
		const result = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.SINGLE_PROPERTY, {params});
		return result.data.data;
	}

	public async getPropertiesByCenter(centerLatitude: number, centerLongitude: number, filterObject?: PropertiesFilter): Promise<GetPropertiesResponse> {
		const bounds: Bounds = this.createBoundsFromCenter(centerLatitude, centerLongitude);
		const boundsQuery = this.propertiesInRectangleQueryFormat(bounds);
		const filterQuery = this.getPropertiesFilterFormat(filterObject);
		const params = {
			search: `${boundsQuery}${filterQuery}`
		};

		const result = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.PROPERTIES_BY_RECTANGLE, {params});
		return {properties: result.data.data.properties};
	}

	public async getPropertiesInRectangle(southWestLatitude: number,
										  northEastLatitude: number,
										  southWestLongitude: number,
										  northEastLongitude: number,
										  filterObject?: PropertiesFilter): Promise<GetPropertiesResponse> {
		const bounds: Bounds = this.createRectangleBounds(southWestLatitude,
			northEastLatitude,
			southWestLongitude,
			northEastLongitude);
		const boundsQuery = this.propertiesInRectangleQueryFormat(bounds);
		const filterQuery = this.getPropertiesFilterFormat(filterObject);
		const params = {
			search: `${boundsQuery}${filterQuery}`
		};

		const result = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.PROPERTIES_BY_RECTANGLE, {params});
		return {properties: result.data.data.properties};
	}

	private createBoundsFromCenter(centerLatitude: number, centerLongitude: number, degreesOfIncreaseArea = 1) {
		const bounds: Bounds = {
			northEastLatitude: centerLatitude + degreesOfIncreaseArea,
			southWestLatitude: centerLatitude - degreesOfIncreaseArea,
			northEastLongitude: centerLongitude + degreesOfIncreaseArea,
			southWestLongitude: centerLongitude - degreesOfIncreaseArea
		};
		return bounds;
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
		const querySuffix = '_coords/1,50_page/';
		// tslint:disable-next-line:max-line-length
		const query = `/${bounds.southWestLatitude},${bounds.northEastLatitude},${bounds.southWestLongitude},${bounds.northEastLongitude}${querySuffix}`;
		return query;
	}

	private getPropertiesFilterFormat(filter: PropertiesFilter) {
		let result = '';
		if (!filter) {
			return result;
		}
		if (filter.priceFilter.maxValue && filter.priceFilter.currency) {
			const priceFilterSuffix = '_price';
			const secondParameter = 0;
			// tslint:disable-next-line:max-line-length
			result = `${result}/${filter.priceFilter.minValue}-${filter.priceFilter.maxValue},${filter.priceFilter.currency},${secondParameter}${priceFilterSuffix}`;
		}
		if (filter.areaFilter.minValue && filter.areaFilter.maxValue && filter.areaFilter.areaUnit) {
			const areaFilterSuffix = '_size';
			result = `${result}/${filter.areaFilter.minValue}-${filter.areaFilter.maxValue},${filter.areaFilter.areaUnit}${areaFilterSuffix}`;
		}
		if (filter.bedFilter) {
			const bedFilterSuffix = '_bedrooms';
			result = `${result}/${filter.bedFilter}${bedFilterSuffix}`;
		}
		if (filter.sorting) {
			const sortSuffix = '_sort';
			result = `${result}/${filter.sorting}${sortSuffix}`;
		}

		return result;
	}

	public async getFavouriteLocations(): Promise<GetFavouriteLocationResponse[]> {
		const result = await this.restService.get(this.apiEndpoint.INTERNAL_ENDPOINTS.FAVOURITE_LOCATIONS);
		return result.data.data;
	}

	public async getMockedFavouriteLocations(): Promise<GetFavouriteLocationResponse[]> {
		const result = await this.mockedFavouriteLocationsService.getMockedFavouriteLocations();
		return result.data;
	}

	public async getNewProperties(): Promise<GetNewPropertiesResponse[]> {
		const result = await this.restService.get(this.apiEndpoint.INTERNAL_ENDPOINTS.NEW_PROPERTIES);
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
			{params: queryParams});

		return true;
	}

	public async requestInfo(propertyId: string, agentId: string, userName: string, userEmail: string, userPhone: string, userRequestDescription: string) {
		const params = {
			propertyId,
			agentId,
			userName,
			userEmail,
			userPhone,
			userRequestDescription
		};
		await this.restService.postWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.REQUEST_PROPERTY_INFO, params);
		return true;
	}
}
