import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd} from '@angular/router';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	public currentYear: number;
	public locations: MapLocation[];
	public shouldShowFooter: boolean;

	constructor(private router: Router) {
		this.locations = new Array<MapLocation>(10);
		// San Francisco
		const sanFrancisco = new MapLocation(-122.419416, 37.774929, 12);
		this.locations[0] = sanFrancisco;
		// Los Angeles
		const losAngeles = new MapLocation(-118.6926056, 34.0201598, 10);
		this.locations[1] = losAngeles;
		// Dubai
		const dubai = new MapLocation(54.94687, 25.075084, 10);
		this.locations[2] = dubai;
		// Beijing
		const beijing = new MapLocation(116.1165888, 39.9385449, 10);
		this.locations[3] = beijing;
		// Moscow
		const moscow = new MapLocation(37.3516344, 55.7494718, 10);
		this.locations[4] = moscow;
		// USA
		const usa = new MapLocation(-113.7509046, 36.2061606, 4);
		this.locations[5] = usa;
		// China
		const china = new MapLocation(86.0191483, 34.4099823, 4);
		this.locations[6] = china;
		// UAE
		const uae = new MapLocation(52.8318969, 24.349865, 8);
		this.locations[7] = uae;
		// Canada
		const canada = new MapLocation(-113.7676258, 54.6903375, 4);
		this.locations[8] = canada;
		// Russia
		const russia = new MapLocation(68.7254341, 49.7236757, 3);
		this.locations[9] = russia;
	}

	ngOnInit() {
		this.currentYear = (new Date()).getFullYear();
		this.router.events
		.filter(event => event instanceof NavigationEnd)
		.subscribe((event: NavigationEnd) => {
			this.shouldShowFooter = !event.url.startsWith('/map');
		});
	}

	public goToMapLocation(id: number) {
		this.router.navigate(['map', {
			latitude: this.locations[id].latitude,
			longitude: this.locations[id].longitude,
			zoom: this.locations[id].zoomLevel
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
