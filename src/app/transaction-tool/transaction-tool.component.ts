import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MenuItem} from 'primeng/primeng';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
	selector: 'app-transaction-tool',
	templateUrl: './transaction-tool.component.html',
	styleUrls: ['./transaction-tool.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TransactionToolComponent implements OnInit {
	public workflowSteps: MenuItem[];
	public activeIndex = 0;

	constructor(private route: ActivatedRoute) {
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
