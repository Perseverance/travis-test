export const notificationType = {
	0: 'reserved',
	1: 'invited',
	2: 'accepted',
	3: 'move-to-next-step',
	4: 'new-document-uploaded',
	5: 'requires-signature',
	6: 'signed',
	7: 'action',
	8: 'payment',
	9: 'transfer'
};

export const transactionToolSteps = {
	'-2': 'rejected',
	'-1': 'canceled',
	0: 'property-preview',
	1: 'invite',
	2: 'purchase-agreement',
	3: 'title-report',
	4: 'disclosures',
	5: 'settlement-statements',
	6: 'payment',
	7: 'affidavit',
	8: 'closing-documents',
	9: 'transfer'
};

export type notificationType = string;
export type transactionToolSteps = string;
