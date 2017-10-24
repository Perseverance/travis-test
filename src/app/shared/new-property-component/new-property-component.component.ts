import {Component, Input, OnInit} from '@angular/core';
import {NewPropertyHome} from '../../properties/properties-responses';
import {Router} from '@angular/router';

@Component({
	selector: 'app-new-property-component',
	templateUrl: './new-property-component.component.html',
	styleUrls: ['./new-property-component.component.scss']
})
export class NewPropertyComponentComponent implements OnInit {
	@Input() property: NewPropertyHome;
	@Input() cityName: string;

	constructor(private router: Router) {
	}

	ngOnInit() {
	}

	public goToProperty(id: string) {
		this.router.navigate(['property', id]);
	}
}
