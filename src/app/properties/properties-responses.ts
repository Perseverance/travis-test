export interface GetPropertiesResponse {
	properties: any;
}

export interface PropertyAgentResponse {
	id: string;
	avatar: string | null;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	rating: number;
	agencyId: string;
	agencyLogo: string | null;
	agencyName: string | null;
	isPro: boolean;
}

export interface GetPropertyResponse {
	id: string;
	status: number;
	type: number;
	verified: boolean;
	owner: string | null;
	address: string;
	price: any;
	desc: string;
	furnished: false;
	bedrooms: number;
	imageUrls: string[];
	longitude: number;
	latitude: number;
	agents: PropertyAgentResponse[];
}

export interface GetFavouriteLocationResponse {
	cityName: string;
	propertiesCount: number;
	longitude: number;
	latitude: number;
	zoomLevel: number;
	imageUrls: string[];
	initialPrice: number;
}

export interface NewPropertyHome {
	id: string;
	type: number;
	address: string;
	description: string;
	bedrooms: number;
	size: CreatePropertyRequestTypedValue;
	price: CreatePropertyRequestTypedValue;
	imageUrls: string[];
}

export interface GetNewPropertiesResponse {
	locationName: string;
	properties: NewPropertyHome[];
}

interface CreatePropertyRequestTypedValue {
	value: number;
	type: number;
}


export interface CreatePropertyRequest {
	bedrooms: number;
	furnished: boolean;
	floor: number;
	price: CreatePropertyRequestTypedValue;
	latitude: number;
	longitude: number;
	size: CreatePropertyRequestTypedValue;
	type: number;
	address: string;
	description: string;
	status: number;

}

export interface CreatePropertyResponse {
	data: string;
}

export interface PropertyImage {
	name: string;
	file: string;
}
