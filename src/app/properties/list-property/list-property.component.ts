import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ErrorsService} from '../../shared/errors/errors.service';
import {TranslateService} from '@ngx-translate/core';
import {ErrorsDecoratableComponent} from '../../shared/errors/errors.decoratable.component';

@Component({
	selector: 'app-list-property',
	templateUrl: './list-property.component.html',
	styleUrls: ['./list-property.component.scss']
})
export class ListPropertyComponent extends ErrorsDecoratableComponent implements OnInit {
	public listPropertyForm: FormGroup;


	constructor(private formBuilder: FormBuilder,
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

	ngOnInit() {
	}

}
