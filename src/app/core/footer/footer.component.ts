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

	public goToAbout() {
		this.router.navigate(['about']);
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
