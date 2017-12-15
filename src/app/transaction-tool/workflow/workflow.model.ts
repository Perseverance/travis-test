export const STEPS = {
	'property-preview': 0,
	'invite': 1,
	'purchase-agreement': 2,
	'title-report': 3,
	'seller-disclosures': 4,
	'settlement-statement': 5,
	'payment': 6,
	'affidavit': 7,
	'closing-documents': 8
};

export const REVERSE_STEPS = {
	0: 'property-preview',
	1: 'invite',
	2: 'purchase-agreement',
	3: 'title-report',
	4: 'seller-disclosures',
	5: 'settlement-statement',
	6: 'payment',
	7: 'affidavit',
	8: 'closing-documents'
};

export type Step = string;
