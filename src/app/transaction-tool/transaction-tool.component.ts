import {REVERSE_STEPS, STEPS} from './workflow/workflow.model';
import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MenuItem} from 'primeng/primeng';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, Router, Params, UrlSegment, NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {DeedsService} from '../shared/deeds.service';
import {Status} from '../smart-contract-connection/smart-contract-connection.service';

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
	public currentState: number;
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

		this.deedStatusIndex = this.getDeedIndexByStatus(deedStatus);
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
				label: 'Invitation',
				command: (event: any) => {
					this.activeIndex = 1;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Purchase Agreement',
				command: (event: any) => {
					this.activeIndex = 2;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Title Report',
				command: (event: any) => {
					this.activeIndex = 3;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);

				}
			},
			{
				label: 'Seller Disclosures',
				command: (event: any) => {
					this.activeIndex = 4;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Closing Documents',
				command: (event: any) => {
					this.activeIndex = 5;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Payment',
				command: (event: any) => {
					this.activeIndex = 6;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			}
		];
	}

	onIndexChange(event) {
		if (event > this.deedStatusIndex) {
			this.currentState = this.deedStatusIndex;
		} else {
			this.currentState = event;
		}
		this.router.navigate(['transaction-tool', this.route.snapshot.params['address'], REVERSE_STEPS[this.currentState]]);

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
		console.log(deed);
		return deed.status;
	}

	private getDeedIndexByStatus(idx: number): number {
		switch (idx) {
			case Status.partiesInvited: {
				return 1;
			}
			case Status.partiesAccepted: {
				return 1;
			}
			case Status.purchaseAgreement: {
				return 2;
			}
			default: {
				return 0;
			}
		}
	}
}
