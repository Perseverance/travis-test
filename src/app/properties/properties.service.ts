import { environment } from './../../environments/environment';
import { APIEndpointsService } from './../shared/apiendpoints.service';
import { RestClientService } from './../shared/rest-client.service';
import { Injectable } from '@angular/core';
import {
	GetPropertiesResponse,
	GetPropertyResponse,
	PropertyAgentResponse,
	GetFavouriteLocationResponse,
	CreatePropertyRequest,
	CreatePropertyResponse
} from './properties-responses';

interface Bounds {
	east: number;
	west: number;
	north: number;
	south: number;
}

@Injectable()
export class PropertiesService {

	constructor(private restService: RestClientService, private apiEndpoint: APIEndpointsService) {
	}

	public async getProperty(propertyId: string): Promise<GetPropertyResponse> {
		const params = {
			id: propertyId
		};
		const result = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.SINGLE_PROPERTY, { params });
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

	public async getPropertiesInRectangle(latitude: number, longitude: number, degreesOfIncreaseArea = 1): Promise<GetPropertiesResponse> {
		const bounds: Bounds = this.createRectangleBounds(latitude, longitude, degreesOfIncreaseArea);
		const query = this.propertiesInRectangleQueryFormat(bounds);
		const params = {
			search: query
		};

		const result = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.PROPERTIES_BY_RECTANGLE, { params });
		return { properties: result.data.data.properties };
	}

	private createRectangleBounds(latitude: number, longitude: number, degreesOfIncreaseArea = 1) {
		const bounds: Bounds = {
			north: latitude + degreesOfIncreaseArea,
			south: latitude - degreesOfIncreaseArea,
			east: longitude + degreesOfIncreaseArea,
			west: longitude - degreesOfIncreaseArea
		};
		return bounds;
	}

	private propertiesInRectangleQueryFormat(bounds: Bounds) {
		const querySuffix = '_coords/1,25_page/';
		const query = `/${bounds.south},${bounds.north},${bounds.west},${bounds.east}${querySuffix}`;
		return query;
	}

	public async getFavouriteLocations(): Promise<GetFavouriteLocationResponse[]> {
		const result = await this.restService.get(this.apiEndpoint.INTERNAL_ENDPOINTS.FAVOURITE_LOCATIONS);
		return result.data.data;
	}

	public async createProperty(data: CreatePropertyRequest): Promise<CreatePropertyResponse> {
		const result = await this.restService.postWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.CREATE_PROPERTY, data);
		return result.data;
	}
}
