import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	public currentYear: number;
	public locations: Array<MapLocation>;
	public isShowFooter: boolean;

	constructor(private router: Router) {
		this.locations = new Array();
		// San Francisco
		this.locations[0] = new MapLocation(-122.419416, 37.774929, 12);
		// Los Angeles
		this.locations[1] = new MapLocation(-118.6926056, 34.0201598, 10);
		// Dubai
		this.locations[2] = new MapLocation(54.94687, 25.075084, 10);
		// Beijing
		this.locations[3] = new MapLocation(116.1165888, 39.9385449, 10);
		// Moscow
		this.locations[4] = new MapLocation(37.3516344, 55.7494718, 10);
		// USA
		this.locations[5] = new MapLocation(-113.7509046, 36.2061606, 4);
		// China
		this.locations[6] = new MapLocation(86.0191483, 34.4099823, 4);
		// UAE
		this.locations[7] = new MapLocation(52.8318969, 24.349865, 8);
		// Canada
		this.locations[8] = new MapLocation(-113.7676258, 54.6903375, 4);
		// Russia
		this.locations[9] = new MapLocation(68.7254341, 49.7236757, 3);
	}

	ngOnInit() {
		this.currentYear = (new Date()).getFullYear();
		this.router.events.subscribe((val) => {
			this.isShowFooter = val.toString().indexOf('/map') < 0;
		});
	}

	public goToMapLocation(id: number) {
		this.router.navigate(['map', {
			latitude: this.locations[id - 1].latitude,
			longitude: this.locations[id - 1].longitude,
			zoom: this.locations[id - 1].zoomLevel
		}]);
	}
}

export class MapLocation {
	longitude: number;
	latitude: number;
	zoomLevel: number;
	constructor(longitude: number, latitude: number, zoomLevel: number) {
		this.longitude = longitude;
		this.latitude = latitude;
		this.zoomLevel = zoomLevel;
	}
}
