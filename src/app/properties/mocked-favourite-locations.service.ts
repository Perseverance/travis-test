import { Injectable } from '@angular/core';

@Injectable()
export class MockedFavouriteLocationsService {

	constructor() { }

	public async getMockedFavouriteLocations() {
		return {
			'message': 'Success_FavouriteLocations',
			'data': [
				{ 'cityName': 'San Francisco', 'propertiesCount': 2438, 'longitude': -122.419416, 'latitude': 37.774929, 'zoomLevel': 12, 'imageUrls': ['http://servicepropy.azurewebsites.net/images/system/favourite-locations/san-francisco.jpg'], 'initialPrice': 10500.0 },
				{ 'cityName': 'Dubai', 'propertiesCount': 71756, 'longitude': 55.270783, 'latitude': 25.204849, 'zoomLevel': 12, 'imageUrls': ['http://servicepropy.azurewebsites.net/images/system/favourite-locations/dubai.jpg'], 'initialPrice': 14976.0 },
				{ 'cityName': 'Beijing', 'propertiesCount': 46093, 'longitude': 116.407395, 'latitude': 39.904211, 'zoomLevel': 13, 'imageUrls': ['http://servicepropy.azurewebsites.net/images/system/favourite-locations/beijing.jpg'], 'initialPrice': 23295.0 },
				{ 'cityName': 'New York', 'propertiesCount': 24184, 'longitude': -74.005941, 'latitude': 40.712784, 'zoomLevel': 13, 'imageUrls': ['http://servicepropy.azurewebsites.net/images/system/favourite-locations/new-york.jpg'], 'initialPrice': 10495.0 },
				{ 'cityName': 'Moscow', 'propertiesCount': 6233, 'longitude': 37.6173, 'latitude': 55.755826, 'zoomLevel': 13, 'imageUrls': ['http://servicepropy.azurewebsites.net/images/system/favourite-locations/moscow.jpg'], 'initialPrice': 10205.0 },
				{ 'cityName': 'Los Angeles', 'propertiesCount': 4781, 'longitude': -118.243685, 'latitude': 34.052234, 'zoomLevel': 13, 'imageUrls': ['http://servicepropy.azurewebsites.net/images/system/favourite-locations/los-angeles.jpg'], 'initialPrice': 10450.0 },
				{ 'cityName': 'Miami', 'propertiesCount': 4745, 'longitude': -80.19179, 'latitude': 25.76168, 'zoomLevel': 12, 'imageUrls': ['http://servicepropy.azurewebsites.net/images/system/favourite-locations/miami.jpg'], 'initialPrice': 12500.0 },
				{ 'cityName': 'London', 'propertiesCount': 185, 'longitude': -0.127758, 'latitude': 51.507351, 'zoomLevel': 13, 'imageUrls': ['http://servicepropy.azurewebsites.net/images/system/favourite-locations/london.jpg'], 'initialPrice': 17500.0 }
			]
		};
	}

}
