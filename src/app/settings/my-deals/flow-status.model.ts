export const FlowStatus = {
	'-2': 'Deal Rejected',
	'-1': 'Deal Canceled',
	0: 'Pending Invitations',
	1: 'Accepting Invitations',
	2: 'Recording Reservation to Blockchain',
	3: 'Purchase Agreement - Pending Upload & Signatures',
	4: 'Recording Purchase Agreement to Blockchain',
	5: 'Title Report - Pending Upload & Signatures',
	6: 'Recording Title Report to Blockchain',
	7: 'Disclosures - Pending Signatures',
	8: 'Recording Disclosures to Blockchain',
	9: 'Settlement Statements - Pending Upload & Acceptance',
	10: 'Awaiting Payment',
	11: 'Closing Documents - Pending Upload',
	12: 'Recording Transfer of Ownership to Blockchain',
	13: 'Completed',
};

export type FlowStatus = string;
