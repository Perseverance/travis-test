import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MenuItem} from 'primeng/primeng';

@Component({
	selector: 'app-transaction-tool',
	templateUrl: './transaction-tool.component.html',
	styleUrls: ['./transaction-tool.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TransactionToolComponent implements OnInit {
	public workflowSteps: MenuItem[];
	public activeIndex = 0;

	constructor() {
	}

	ngOnInit() {
		this.workflowSteps = [
			{
				label: '',
				command: (event: any) => {
					this.activeIndex = 0;
				}
			},
			{
				label: '',
				command: (event: any) => {
					this.activeIndex = 1;
				}
			},
			{
				label: '',
				command: (event: any) => {
					this.activeIndex = 2;
				}
			},
			{
				label: '',
				command: (event: any) => {
					this.activeIndex = 3;
				}
			}
		];
	}

}
