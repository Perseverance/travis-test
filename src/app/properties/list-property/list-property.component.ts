import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ErrorsService} from '../../shared/errors/errors.service';
import {TranslateService} from '@ngx-translate/core';
import {ErrorsDecoratableComponent} from '../../shared/errors/errors.decoratable.component';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
	selector: 'app-list-property',
	templateUrl: './list-property.component.html',
	styleUrls: ['./list-property.component.scss']
})
export class ListPropertyComponent extends ErrorsDecoratableComponent implements OnInit {
	public isUserAnonymous: boolean;
	public hasLoaded: boolean;
	public listPropertyForm: FormGroup;

	constructor(private formBuilder: FormBuilder,
				private authService: AuthenticationService,
				errorsService: ErrorsService,
				translateService: TranslateService) {
		super(errorsService, translateService);

		this.listPropertyForm = this.formBuilder.group({
			email: ['',
				[Validators.required, Validators.email]
			],
			firstName: ['', [Validators.required]],
			lastName: ['', [Validators.required]]
		});
	}

	async ngOnInit() {
		const result = await this.authService.isUserAnyonymous();
		this.isUserAnonymous = result;
		this.hasLoaded = true;
	}
}
