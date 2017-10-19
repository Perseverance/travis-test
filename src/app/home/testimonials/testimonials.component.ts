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
		this.testemonialsDescriptions.push({value: 'It would be an enormous step forward if global real estate transactions were to be facilitated by a reliable,' + '\n' + '\n' + 'automated land registration and transfer system. Propy\'s proposed use of blockchain might just offer the key that opens this door.'});
		this.testemonialsDescriptions.push({value: 'The leadership of the company is impressive, shows all the signs of persistence and execution. Andrey Zamovski is very intelligent and innovative at usage of his deep knowledge of cryptography and Ethereum Smart Contracts. The team is also international - founders and early employees from Russia, Ukraine, US and Singapore are sharing the knowledge of their markets.'});
		this.testemonialsDescriptions.push({value: 'It would be an enormous step forward if global real estate transactions were to be facilitated by a reliable, automated land registration and transfer system.Propy\'s proposed use of blockchain might just offer the key that opens this door.'});
		this.testemonialsDescriptions.push({value: 'The word Global is & has been innocently or deceptively overused and in the real estate business, as practitioners only see the world from their window rather than from every country of every continent. A notable exception can be made for Propy. To my knowledge, this platform is the only one today capable of unifying and standardizing property listings in global cities, whether in the US, China, Russia, the Middle-East and Europe. If you add to that their ability to provide instant purchase deposit in escrow and manage transaction payment services, Propy is well on its way to automatizing the purchase process all the way to online title delivery. It is potentially a game-changer in our industry.'});

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
