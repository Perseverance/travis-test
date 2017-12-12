import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthenticationService, UserData} from '../../authentication/authentication.service';
import {UserRoleEnum} from '../enums/user-role.enum';
import {DeedDocumentType} from '../enums/deed-document-type.enum';

@Component({
	selector: 'app-sign-document',
	templateUrl: './sign-document.component.html',
	styleUrls: ['./sign-document.component.scss']
})
export class SignDocumentComponent implements OnInit {
	public userRoleEnum = UserRoleEnum;
	public deedDocumentTypeEnum = DeedDocumentType;
	public currentUserRole: number;
	@Input() buyerIsParticipant = false;
	@Input() sellerIsParticipant = false;
	@Input() brokerIsParticipant = false;
	@Input() escrowIsParticipant = false;
	@Input() hasBuyerSigned: boolean;
	@Input() hasSellerSigned: boolean;
	@Input() hasBrokerSigned: boolean;
	@Input() hasEscrowSigned: boolean;
	@Input() showSignButton: boolean;
	@Input() documentType: any;
	@Output() onSignDocument = new EventEmitter<any>();

	constructor(private authService: AuthenticationService) {
		this.authService.subscribeToUserData({
			next: async (userInfo: UserData) => {
				if (!userInfo.user) {
					return;
				}
				this.currentUserRole = userInfo.user.role;
			}
		});
	}

	ngOnInit() {
	}

	public onSignDocumentClick() {
		this.onSignDocument.emit();
	}
}
