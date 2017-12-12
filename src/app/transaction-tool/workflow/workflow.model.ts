export const STEPS = {
	'property-preview': 0,
	'invite': 1,
	'purchase-agreement': 2,
	'settlement-statement': 3,
	'seller-disclosures': 4,
	'closing-documents': 5,
	'payment': 6
};

export const REVERSE_STEPS = {
	0: 'property-preview',
	1: 'invite',
	2: 'purchase-agreement',
	3: 'settlement-statement',
	4: 'seller-disclosures',
	5: 'closing-documents',
	6: 'payment'
};

export type Step = string;
