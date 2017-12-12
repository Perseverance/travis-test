import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-property-preview',
	templateUrl: './property-preview.component.html',
	styleUrls: ['./property-preview.component.scss']
})
export class PropertyPreviewComponent implements OnInit {
	public deedId: string;
	private addressSubscription: Subscription;
	constructor(private route: ActivatedRoute) { }

	ngOnInit() {
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedId) {
			if (!deedId) {
				throw new Error('No deed address supplied');
			}
			self.deedId = deedId;
		});
	}

}
