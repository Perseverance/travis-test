export const STEPS = {
	'reserve': 0,
	'invite-seller': 1,
	'invite-escrow': 2,
	'purchase-agreement': 3,
	'settlement-statement': 4,
	'seller-disclosures': 5
};

export const REVERSE_STEPS = {
	0: 'reserve',
	1: 'invite-seller',
	2: 'invite-escrow',
	3: 'purchase-agreement',
	4: 'settlement-statement',
	5: 'seller-disclosures'
};

export type Step = string;
