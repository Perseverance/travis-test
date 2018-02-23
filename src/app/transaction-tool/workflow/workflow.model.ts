// ToDo: Affidavit step hide, next steps are decremented with 1

export const STEPS = {
	'rejected': -2,
	'canceled': -1,
	'property-preview': 0,
	'invite': 1,
	'purchase-agreement': 2,
	'title-report': 3,
	'disclosures': 4,
	'settlement-statements': 5,
	'payment': 6,
	// 'affidavit': 7,
	'closing-documents': 7,
	'transfer': 8
};

export const REVERSE_STEPS = {
	'-2': 'rejected',
	'-1': 'canceled',
	0: 'property-preview',
	1: 'invite',
	2: 'purchase-agreement',
	3: 'title-report',
	4: 'disclosures',
	5: 'settlement-statements',
	6: 'payment',
	// 7: 'affidavit',
	7: 'closing-documents',
	8: 'transfer'
};

export type Step = string;
