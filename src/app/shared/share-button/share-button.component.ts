import { Component, Input, OnInit } from '@angular/core';
import { NgSwitch } from '@angular/common';

import { FacebookShareComponent } from './components/index';


import { environment } from '../../../environments/environment.prod';

@Component({
	selector: 'app-share-button',
	templateUrl: './share-button.component.html',
	styleUrls: ['./share-button.component.scss']
})

export class ShareButtonComponent implements OnInit {
	@Input() property: any;
	@Input() userInfo: any;
	@Input() isFeaturedProperty: any;

	private _isChina: boolean;

	constructor() {
	}

	ngOnInit() {
		environment.china ? this._isChina = true : this._isChina = false;
	}

}
