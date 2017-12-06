import { REVERSE_STEPS } from './workflow/workflow.model';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-transaction-tool',
	templateUrl: './transaction-tool.component.html',
	styleUrls: ['./transaction-tool.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TransactionToolComponent implements OnInit {
	public workflowSteps: MenuItem[];
	public activeIndex = 1;
	constructor(private route: ActivatedRoute, private router: Router) {
	}

	ngOnInit() {

		this.workflowSteps = [
			{
				label: 'Property Preview',
				command: (event: any) => {
					this.activeIndex = 0;
				}
			},
			{
				label: 'Invite Seller',
				command: (event: any) => {
					this.activeIndex = 1;
				}
			},
			{
				label: 'Invite Escrow',
				command: (event: any) => {
					this.activeIndex = 2;
				}
			},
			{
				label: 'Purchase Agreement',
				command: (event: any) => {
					this.activeIndex = 3;
				}
			},
			{
				label: 'Settlement Statement',
				command: (event: any) => {
					this.activeIndex = 4;
				}
			},
			{
				label: 'Seller Disclosures',
				command: (event: any) => {
					this.activeIndex = 5;
				}
			}
		];
	}
	onIndexChange(event) {
		this.router.navigate(['transaction-tool', this.route.snapshot.params['address'], REVERSE_STEPS[event]]);
	}
}
