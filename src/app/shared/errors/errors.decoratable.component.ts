import { ErrorsService } from './../../shared/errors/errors.service';
import { TranslateService } from '@ngx-translate/core';

export class ErrorsDecoratableComponent {

	constructor(protected errorsService: ErrorsService,
		protected translateService: TranslateService) { }

}