import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgxCarousel} from 'ngx-carousel';
import {TranslateService} from '@ngx-translate/core';

@Component({
	selector: 'app-testimonials',
	templateUrl: './testimonials.component.html',
	styleUrls: ['./testimonials.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TestimonialsComponent implements OnInit {
	public testemonialsDescriptions = [];
	public carouselTile: NgxCarousel;
	private PINEL_WORDS_KEY = 'landing.testimonials.pinel-words';
	private ARRINGTON_WORDS_KEY = 'landing.testimonials.arrington-words';
	private GARDNER_WORDS_KEY = 'landing.testimonials.gardner-words';

	constructor(public translateService: TranslateService) {
		this.testemonialsDescriptions.push({
			dummyValue: '',
			value: ''
		});
		this.testemonialsDescriptions.push({
			dummyValue: '',
			value: ''
		});
		this.testemonialsDescriptions.push({
			dummyValue: '',
			value: ''
		});

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

		this.translateService.stream(this.PINEL_WORDS_KEY).subscribe((keyTranslation: string) => {
			this.testemonialsDescriptions[0].value = keyTranslation;
			this.testemonialsDescriptions[0].dummyValue = keyTranslation;
			this.testemonialsDescriptions[1].dummyValue = keyTranslation;
			this.testemonialsDescriptions[2].dummyValue = keyTranslation;
		});

		this.translateService.stream(this.ARRINGTON_WORDS_KEY).subscribe((keyTranslation: string) => {
			this.testemonialsDescriptions[1].value = keyTranslation;
		});

		this.translateService.stream(this.GARDNER_WORDS_KEY).subscribe((keyTranslation: string) => {
			this.testemonialsDescriptions[2].value = keyTranslation;
		});
	}

	ngOnInit() {
	}
}
