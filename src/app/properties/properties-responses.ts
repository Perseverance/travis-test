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
	price: number;
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
}


export interface CreatePropertyRequest {
	field: any;
}

export interface CreatePropertyResponse {
	field: any;
}
