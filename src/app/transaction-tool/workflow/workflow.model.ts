export const STEPS = {
	'property-preview': 0,
	'invite-seller': 1,
	'accept-seller': 2,
	'invite-escrow': 3,
	'accept-escrow': 4,
	'purchase-agreement': 5,
	'settlement-statement': 6,
	'seller-disclosures': 7,
	'closing-documents': 8,
	'payment': 9
};

export const REVERSE_STEPS = {
	0: 'property-preview',
	1: 'invite-seller',
	2: 'accept-seller',
	3: 'invite-escrow',
	4: 'accept-escrow',
	5: 'purchase-agreement',
	6: 'settlement-statement',
	7: 'seller-disclosures',
	8: 'closing-documents',
	9: 'payment'
};

export type Step = string;
