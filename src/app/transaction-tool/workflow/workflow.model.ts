// ToDo: Affidavit step hide, next steps are decremented with 1

export const STEPS = {
	'rejected': -2,
	'canceled': -1,
	'property-preview': 0,
	'invite': 1,
	'purchase-agreement': 2,
	'deposit-payment': 3,
	'title-report': 4,
	'disclosures': 5,
	'settlement-statements': 6,
	'payment': 7,
	// 'affidavit': 7,
	'closing-documents': 8,
	'transfer': 9
};

export const REVERSE_STEPS = {
	'-2': 'rejected',
	'-1': 'canceled',
	0: 'property-preview',
	1: 'invite',
	2: 'purchase-agreement',
	3: 'deposit-payment',
	4: 'title-report',
	5: 'disclosures',
	6: 'settlement-statements',
	7: 'payment',
	// 7: 'affidavit',
	8: 'closing-documents',
	9: 'transfer'
};

export type Step = string;
