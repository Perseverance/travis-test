import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgxCarousel} from 'ngx-carousel';

@Component({
	selector: 'app-testimonials',
	templateUrl: './testimonials.component.html',
	styleUrls: ['./testimonials.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TestimonialsComponent implements OnInit {
	public testemonialsDescriptions = [];
	public carouselTile: NgxCarousel;

	constructor() {
	}

	ngOnInit() {
		this.testemonialsDescriptions.push({value: 'Description 1'});
		this.testemonialsDescriptions.push({value: 'Description 2'});
		this.testemonialsDescriptions.push({value: 'Description 3'});
		this.testemonialsDescriptions.push({value: 'Description 4'});

		this.carouselTile = {
			grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
			slide: 1,
			speed: 400,
			point: {
				visible: true,
				pointStyles: ``
			},
			easing: 'ease'
		};
	}
}
