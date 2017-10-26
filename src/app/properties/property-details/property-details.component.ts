import { NgxCarousel } from 'ngx-carousel';
import { RedirectableComponent } from './../../shared/redirectable/redirectable.component';
import { GetPropertyResponse } from './../properties-responses';
import { AuthenticationService } from './../../authentication/authentication.service';
import { PropertiesService } from './../properties.service';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-property-details',
	templateUrl: './property-details.component.html',
	styleUrls: ['./property-details.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PropertyDetailsComponent extends RedirectableComponent implements OnInit, OnDestroy {

	public property: GetPropertyResponse;
	private idSubscription: Subscription;
	public propertyImagesCarouselConfig: NgxCarousel;
	public IMAGE_HEIGHT_PX = 480;
	public IMAGE_WIDTH_PX: number;

	constructor(
		router: Router,
		private route: ActivatedRoute,
		private propertiesService: PropertiesService,
		private authService: AuthenticationService) {
		super(router);
		this.IMAGE_WIDTH_PX = window.screen.width;
	}

	async ngOnInit() {
		this.propertyImagesCarouselConfig = {
			grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
			slide: 1,
			speed: 600,
			point: {
				visible: true,
				pointStyles: `.ngxcarouselPoint {display: none}` // Removing the points as the visible: false property does not work
			},
			easing: 'ease'
		};
		const self = this;
		const idObservable: Observable<string> = self.route.params.map(p => p.id);
		this.idSubscription = idObservable.subscribe(async function (propertyId) {
			self.property = await self.propertiesService.getProperty(propertyId);
		});

	}

	ngOnDestroy() {
		this.idSubscription.unsubscribe();
	}

}
