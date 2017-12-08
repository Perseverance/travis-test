export const STEPS = {
	'property-preview': 0,
	'invite-seller': 1,
	'invite-escrow': 2,
	'purchase-agreement': 3,
	'settlement-statement': 4,
	'seller-disclosures': 5,
	'closing-documents': 6,
	'payment': 7
};

export const REVERSE_STEPS = {
	0: 'property-preview',
	1: 'invite-seller',
	2: 'invite-escrow',
	3: 'purchase-agreement',
	4: 'settlement-statement',
	5: 'seller-disclosures',
	6: 'closing-documents',
	7: 'payment'
};

export type Step = string;
