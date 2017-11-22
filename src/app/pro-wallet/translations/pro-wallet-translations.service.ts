import {Injectable} from '@angular/core';
import {ProTransactionStatusEnum} from '../enums/pro-transaction-status.enum';
import {RewardTypeEnum} from '../enums/reward-type.enum';

@Injectable()
export class ProWalletTranslationsService {

	constructor() {
	}

	public getTransactionStatusKey(value: number): string {
		const pendingKey = 'pending';
		const completedKey = 'completed';
		const rejectedKey = 'rejected';

		switch (value) {
			case ProTransactionStatusEnum.Pending: {
				return `${pendingKey}`;
			}
			case ProTransactionStatusEnum.Completed: {
				return `${completedKey}`;
			}
			case ProTransactionStatusEnum.Rejected: {
				return `${rejectedKey}`;
			}
		}
	}

	public getTransactionReasonKey(value: number): string {
		const registrationKey = 'registration';
		const agentRegistrationKey = 'agent-registration';
		const affiliateRegisterKey = 'affiliate-register';
		const affiliateOwnerRegisterKey = 'affiliate-owner-register';
		const checkInKey = 'check-in';
		const premiumPropertyKey = 'premium-property';
		const tokensRedeemedKey = 'tokens-redeemed';

		switch (value) {
			case RewardTypeEnum.Registration: {
				return `${registrationKey}`;
			}
			case RewardTypeEnum.AgentRegistration: {
				return `${agentRegistrationKey}`;
			}
			case RewardTypeEnum.AffiliateRegister: {
				return `${affiliateRegisterKey}`;
			}
			case RewardTypeEnum.AffiliateOwnerRegister: {
				return `${affiliateOwnerRegisterKey}`;
			}
			case RewardTypeEnum.Checkin: {
				return `${checkInKey}`;
			}
			case RewardTypeEnum.PremiumProperty: {
				return `${premiumPropertyKey}`;
			}
			case RewardTypeEnum.TokensRedeemed: {
				return `${tokensRedeemedKey}`;
			}
		}
	}

}
