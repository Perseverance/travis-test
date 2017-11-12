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
		const sanFrancisco = new MapLocation(-122.419416, 37.774929, 12);
		this.locations[0] = sanFrancisco;
		const losAngeles = new MapLocation(-118.6926056, 34.0201598, 10);
		this.locations[1] = losAngeles;
		const dubai = new MapLocation(54.94687, 25.075084, 10);
		this.locations[2] = dubai;
		const beijing = new MapLocation(116.1165888, 39.9385449, 10);
		this.locations[3] = beijing;
		const moscow = new MapLocation(37.3516344, 55.7494718, 10);
		this.locations[4] = moscow;
		const usa = new MapLocation(-113.7509046, 36.2061606, 4);
		this.locations[5] = usa;
		const china = new MapLocation(86.0191483, 34.4099823, 4);
		this.locations[6] = china;
		const uae = new MapLocation(52.8318969, 24.349865, 8);
		this.locations[7] = uae;
		const canada = new MapLocation(-113.7676258, 54.6903375, 4);
		this.locations[8] = canada;
		const russia = new MapLocation(37.3516344, 55.7494718, 5);
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
