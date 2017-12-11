import { REVERSE_STEPS, STEPS } from './workflow/workflow.model';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, Params, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DeedsService } from '../shared/deeds.service';

@Component({
	selector: 'app-transaction-tool',
	templateUrl: './transaction-tool.component.html',
	styleUrls: ['./transaction-tool.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TransactionToolComponent implements OnInit {
	public workflowSteps: MenuItem[];
	public activeIndex = 0;
	public deedStatusIndex: number;

	constructor(private route: ActivatedRoute, private router: Router,
		private deedsService: DeedsService) {
	}

	async ngOnInit() {
		const deedStatus = await this.getDeedStatus(this.route.snapshot.params['address']);
		this.deedStatusIndex = deedStatus + 1;
		this.activeIndex = STEPS[this.route.snapshot.firstChild.url[0].path];
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
				label: 'Seller Invitation Response',
				command: (event: any) => {
					this.activeIndex = 2;
				}
			},
			{
				label: 'Invite Escrow',
				command: (event: any) => {
					this.activeIndex = 3;
				}
			},
			{
				label: 'Escrow Invitation Response',
				command: (event: any) => {
					this.activeIndex = 4;
				}
			},
			{
				label: 'Purchase Agreement',
				command: (event: any) => {
					this.activeIndex = 5;
				}
			},
			{
				label: 'Settlement Statement',
				command: (event: any) => {
					this.activeIndex = 6;
				}
			},
			{
				label: 'Seller Disclosures',
				command: (event: any) => {
					this.activeIndex = 7;
				}
			},
			{
				label: 'Closing Documents',
				command: (event: any) => {
					this.activeIndex = 8;
				}
			},
			{
				label: 'Payment',
				command: (event: any) => {
					this.activeIndex = 9;
				}
			}
		];
	}

	onIndexChange(event) {
		this.router.navigate(['transaction-tool', this.route.snapshot.params['address']]);
	}

	public moveToPrevStep() {
		const prevIndex = +this.activeIndex - 1;
		this.activeIndex = prevIndex;
		this.router.navigate(['transaction-tool', this.route.snapshot.params['address'], REVERSE_STEPS[prevIndex]]);
	}

	public moveToNextStep() {
		const nextIndex = +this.activeIndex + 1;
		if (nextIndex > this.deedStatusIndex) {
			return;
		}
		this.activeIndex = nextIndex;
		this.router.navigate(['transaction-tool', this.route.snapshot.params['address'], REVERSE_STEPS[nextIndex]]);
	}

	public async getDeedStatus(deedId: string): Promise<number> {
		const deed = await this.deedsService.getDeedDetails(deedId);
		return deed.status;
	}
}
