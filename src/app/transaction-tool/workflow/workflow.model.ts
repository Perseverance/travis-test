export const STEPS = {
	'invite-seller': 1,
	'invite-escrow': 2,
	'purchase-agreement': 3
};

export const REVERSE_STEPS = {
	1: 'invite-seller',
	2: 'invite-escrow',
	3: 'purchase-agreement'
};

export type Step = string;
