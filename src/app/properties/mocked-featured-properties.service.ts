import { Injectable } from '@angular/core';

@Injectable()
export class MockedFeaturedPropertiesService {

	constructor() { }

	public async getMockedFeaturedLocations() {
		return {
			'message': 'Success_FeaturedLocations',
			'data': [
				{ 'id': '5a393b064170310df43e92bd', 'address': '7105 Regina Dr, Englewood, FL 34224, USA', 'cityName': 'Englewood', 'imageUrls': ['https://servicepropy.azurewebsites.net/images/5a393b064170310df43e92bd/3c455e22-7e20-439d-a3c9-62c69b67bc9c.jpg?width=768&height=480&scale=both&mode=crop'], 'price': { 'value': 150000, 'priceType': 1 }, 'bedrooms': 2, 'size': 976, 'sizeType': 1, 'type': 1, 'bitcoinAvailable': false },
				{ 'id': '5a393fda4170310df43e92ec', 'address': '15300 Johnson St, Fort Myers, FL 33908, USA', 'cityName': 'Fort Myers', 'imageUrls': ['https://servicepropy.azurewebsites.net/images/5a393fda4170310df43e92ec/d739143a-3902-43f7-8014-1d05d2a2e072.jpg?width=768&height=480&scale=both&mode=crop'], 'price': { 'value': 119900, 'priceType': 1 }, 'bedrooms': 2, 'size': 810, 'sizeType': 1, 'type': 1, 'bitcoinAvailable': false },
				{ 'id': '5a3980e64170310df43e959a', 'address': '910 Stadium Dr, Green Bay, WI 54304, USA', 'cityName': 'Green Bay', 'imageUrls': ['https://servicepropy.azurewebsites.net/images/5a3980e64170310df43e959a/ead839ff-b202-404d-ad83-5d05177a641e.jpg?width=768&height=480&scale=both&mode=crop'], 'price': { 'value': 1000000, 'priceType': 1 }, 'bedrooms': 3, 'size': 93.27465216, 'sizeType': 1, 'type': 1, 'bitcoinAvailable': true },
				{ 'id': '5a393ea44170310df43e92e6', 'address': '291 Lowell Ave, North Fort Myers, FL 33917, USA', 'cityName': 'North Fort Myers', 'imageUrls': ['https://servicepropy.azurewebsites.net/images/5a393ea44170310df43e92e6/903de6cb-b170-49b5-ba39-f89147a81ee6.jpg?width=768&height=480&scale=both&mode=crop'], 'price': { 'value': 289900, 'priceType': 1 }, 'bedrooms': 2, 'size': 2088, 'sizeType': 1, 'type': 20, 'bitcoinAvailable': false },
				{ 'id': '5a393d244170310df43e92d1', 'address': '11322 4th Ave, Punta Gorda, FL 33955, USA', 'cityName': 'Punta Gorda', 'imageUrls': ['https://servicepropy.azurewebsites.net/images/5a393d244170310df43e92d1/5959c866-9775-479d-b682-969f255046ac.jpg?width=768&height=480&scale=both&mode=crop'], 'price': { 'value': 105000, 'priceType': 1 }, 'bedrooms': 2, 'size': 940, 'sizeType': 1, 'type': 1, 'bitcoinAvailable': false },

			]
		};
	}
}
