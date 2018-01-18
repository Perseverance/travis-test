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

export interface GetFavouriteLocationResponse {
	cityName: string;
	propertiesCount: number;
	longitude: number;
	latitude: number;
	zoomLevel: number;
	imageUrls: string[];
	initialPrice: number;
}

export interface GetFeaturePropertiesResponse {
	id: string;
	address: string;
	cityName: string;
	imageUrls: string[];
	price: any;
	bedrooms: number;
	size: number;
	sizeType: number;
	type: number;
	bitcoinAvailable: boolean;
}


export interface PropertyPreviewResponse {
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
	properties: PropertyPreviewResponse[];
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

export interface HidePropertyRequest {
	id: number;
}

export interface HidePropertyResponse {
	data: string;
}
