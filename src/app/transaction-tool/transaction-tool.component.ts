import { UserData, AuthenticationService } from './../authentication/authentication.service';
import { SmartContractConnectionService } from './../smart-contract-connection/smart-contract-connection.service';
import { REVERSE_STEPS, STEPS } from './workflow/workflow.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DeedsService } from '../shared/deeds.service';
import { Status } from '../smart-contract-connection/smart-contract-connection.service';

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
	public areStepsActive = false;

	constructor(private route: ActivatedRoute, private router: Router,
	            private deedsService: DeedsService, private smartContractService: SmartContractConnectionService,
	            private authService: AuthenticationService) {
		this.router.events
			.filter(event => event instanceof NavigationEnd)
			.subscribe((event: NavigationEnd) => {
				this.addressRoute = (event.urlAfterRedirects.substring(event.urlAfterRedirects.lastIndexOf('/')).slice(1));
			});

		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (userInfo.isAnonymous) {
					return;
				}
				if (!userInfo.user) {
					return;
				}
				this.smartContractService.saveCredentials(JSON.parse(userInfo.user.jsonFile));
			}
		});
	}

	async ngOnInit() {
		const deedStatus = await this.getDeedStatus(this.route.snapshot.params['address']);

		this.areStepsActive = (deedStatus >= 0);

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
				disabled: (this.deedStatusIndex < 1),
				command: (event: any) => {
					this.activeIndex = 1;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Purchase Agreement',
				disabled: (this.deedStatusIndex < 2),
				command: (event: any) => {
					this.activeIndex = 2;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Deposit Payment',
				disabled: (this.deedStatusIndex < 3),
				command: (event: any) => {
					this.activeIndex = 3;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Title Report',
				disabled: (this.deedStatusIndex < 4),
				command: (event: any) => {
					this.activeIndex = 4;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);

				}
			},
			{
				label: 'Disclosures',
				disabled: (this.deedStatusIndex < 5),
				command: (event: any) => {
					this.activeIndex = 5;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Settlement Statements',
				disabled: (this.deedStatusIndex < 6),
				command: (event: any) => {
					this.activeIndex = 6;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Payment',
				disabled: (this.deedStatusIndex < 7),
				command: (event: any) => {
					this.activeIndex = 7;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			// {
			// 	label: 'Affidavit',
			// 	disabled: (this.deedStatusIndex < 7),
			// 	command: (event: any) => {
			// 		this.activeIndex = 7;
			// 		this.activeIndex = this.getCurrentStatus(this.activeIndex);
			// 	}
			// },
			{
				label: 'Closing Documents',
				disabled: (this.deedStatusIndex < 8),
				command: (event: any) => {
					this.activeIndex = 8;
					this.activeIndex = this.getCurrentStatus(this.activeIndex);
				}
			},
			{
				label: 'Ownership Transfer',
				disabled: (this.deedStatusIndex < 9),
				command: (event: any) => {
					this.activeIndex = 9;
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
		return deed.status;
	}

	// ToDo: Affidavit step hide, next steps are decremented with 1

	private getDeedIndexByStatus(idx: number): number {
		switch (idx) {
			case Status.reserve: {
				return 1;
			}
			case Status.partiesInvited: {
				return 1;
			}
			case Status.partiesAccepted: {
				return 1;
			}
			case Status.reservedOnBlockchain: {
				return 2;
			}
			case Status.purchaseAgreement: {
				return 2;
			}
			case Status.purchaseAgreementBlockchain: {
				return 3;
			}
			case Status.depositPayment: {
				return 4;
			}
			case Status.titleReport: {
				return 4;
			}
			case Status.titleReportBlockchain: {
				return 5;
			}
			case Status.Disclosures: {
				return 5;
			}
			case Status.DisclosuresBlockchain: {
				return 6;
			}
			case Status.settlementStatement: {
				return 7;
			}
			case Status.payment: {
				return 8;
			}
			// case Status.affidavit: {
			// 	return 7;
			// }
			// case Status.affidavitBlockchain: {
			// 	return 8;
			// }
			case Status.closingDocuments: {
				return 9;
			}
			case Status.transferred: {
				return 8;
			}
			default: {
				return 0;
			}
		}
	}

	public async updateProgressIndex() {
		await this.ngOnInit();
	}
}
