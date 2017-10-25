import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-refferal',
	templateUrl: './referral.component.html',
	styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {
	constructor(private activeRoute: ActivatedRoute,
		private router: Router) {
	}

	ngOnInit() {
		const referrerId = this.activeRoute.snapshot.queryParams['referrerId'];
		this.router.navigate(['signup', { referral: referrerId }]);
	}
}
