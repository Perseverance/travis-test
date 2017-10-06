import { ErrorsService, DisplayableError } from './../../shared/errors/errors.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-error-message',
	templateUrl: './error-message.component.html',
	styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {

	private DEFAULT_ERROR_TITLE = 'An Error Occured!';
	private DEFAULT_ERROR_TIME = 5000;

	public errorMessage: string;
	public errorTitle: string;
	public isErrorShown = false;
	public timer: any;

	constructor(private errorsService: ErrorsService) { }

	ngOnInit() {
		const self = this;
		this.errorsService.subscribeToErrors({
			next: (error: DisplayableError) => {
				clearTimeout(this.timer);
				this.hideError();

				this.errorTitle = this.DEFAULT_ERROR_TITLE;
				if (error.errorTitle) {
					this.errorTitle = error.errorTitle;
				}

				this.errorMessage = error.errorMessage;
				this.showError();

				this.timer = setTimeout(function () {
					self.hideError();
				}, this.DEFAULT_ERROR_TIME);
			}
		});
	}

	private showError() {
		this.isErrorShown = true;
	}

	private hideError() {
		this.isErrorShown = false;
	}

}
