import { REVERSE_STEPS, STEPS } from './workflow/workflow.model';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, Params, UrlSegment, NavigationEnd } from '@angular/router';
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
	public curreentState: number;
	public addressRoute: string;

	constructor(private route: ActivatedRoute, private router: Router,
		private deedsService: DeedsService) {
		this.router.events
			.filter(event => event instanceof NavigationEnd)
			.subscribe((event: NavigationEnd) => {
				this.addressRoute = (event.url.substring(event.url.lastIndexOf('/')).slice(1));
			});

	}

	async ngOnInit() {
		const deedStatus = await this.getDeedStatus(this.route.snapshot.params['address']);
		this.deedStatusIndex = deedStatus + 1;
		this.activeIndex = STEPS[this.addressRoute];
		this.workflowSteps = [
			{
				label: 'Property Preview',
				command: (event: any) => {
					this.activeIndex = 0;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Invite Seller',
				command: (event: any) => {
					this.activeIndex = 1;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Seller Invitation Response',
				command: (event: any) => {
					this.activeIndex = 2;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Invite Escrow',
				command: (event: any) => {
					this.activeIndex = 3;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Escrow Invitation Response',
				command: (event: any) => {
					this.activeIndex = 4;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Purchase Agreement',
				command: (event: any) => {
					this.activeIndex = 5;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Settlement Statement',
				command: (event: any) => {
					this.activeIndex = 6;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);

				}
			},
			{
				label: 'Seller Disclosures',
				command: (event: any) => {
					this.activeIndex = 7;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Closing Documents',
				command: (event: any) => {
					this.activeIndex = 8;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Payment',
				command: (event: any) => {
					this.activeIndex = 9;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			}
		];
	}

	onIndexChange(event) {
		if (event > this.deedStatusIndex) {
			this.curreentState = this.deedStatusIndex;
		} else {
			this.curreentState = event;
		}
		this.router.navigate(['transaction-tool', this.route.snapshot.params['address'], REVERSE_STEPS[this.curreentState]]);

	}
	public getCurrentStatus(currentActiveIndex: number) {
		if (currentActiveIndex <= this.deedStatusIndex) {
			return currentActiveIndex;
		}
		return this.deedStatusIndex;
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
