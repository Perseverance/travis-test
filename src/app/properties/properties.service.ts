import {environment} from './../../environments/environment';
import {APIEndpointsService} from './../shared/apiendpoints.service';
import {RestClientService} from './../shared/rest-client.service';
import {Injectable} from '@angular/core';
import {
	GetPropertiesResponse,
	GetPropertyResponse,
	PropertyAgentResponse,
	GetFavouriteLocationResponse,
	CreatePropertyRequest,
	CreatePropertyResponse,
	PropertyImage, GetNewPropertiesResponse, NewPropertyHome
} from './properties-responses';
import {LocalStorageService} from '../shared/localStorage.service';

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

	public async getProperty(propertyId: string): Promise<GetPropertyResponse> {
		const params = {
			id: propertyId
		};
		const result = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.SINGLE_PROPERTY, {params});
		const imageUrls = new Array<string>();
		for (const path of result.data.data.imageUrls) {
			imageUrls.push(`${environment.apiUrl}${path}`);
		}
		const agents = new Array<PropertyAgentResponse>();
		for (const agent of result.data.data.agents) {
			agents.push({
				id: agent.id,
				avatar: agent.avatar,
				firstName: agent.firstName,
				lastName: agent.lastName,
				phoneNumber: agent.phoneNumber,
				rating: agent.rating,
				agencyId: agent.agencyId,
				agencyLogo: agent.agencyLogo,
				agencyName: agent.agencyName,
				isPro: agent.isPro
			});
		}
		return {
			id: result.data.data.id,
			status: result.data.data.status,
			type: result.data.data.type,
			verified: result.data.data.verified,
			owner: result.data.data.owner,
			address: result.data.data.address,
			price: result.data.data.price,
			desc: result.data.data.desc,
			furnished: result.data.data.furnished,
			bedrooms: result.data.data.bedrooms,
			longitude: result.data.data.longitude,
			latitude: result.data.data.latitude,
			agents,
			imageUrls
		};
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

		const result = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.PROPERTIES_BY_RECTANGLE, {params});
		return {properties: result.data.data.properties};
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
		const result = await this.restService.get(this.apiEndpoint.INTERNAL_ENDPOINTS.FAVOURITE_LOCATIONS, {params: queryParams});
		return result.data.data;
	}

	public async getNewProperties(): Promise<GetNewPropertiesResponse[]> {
		const queryParams = {
			currency: this.localStorageService.selectedCurrencyType
		};
		const result = await this.restService.get(this.apiEndpoint.INTERNAL_ENDPOINTS.NEW_PROPERTIES, {params: queryParams});
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
}
