export interface UserTransactionsHistoryResponse {
	stashedTokensBalance: number;
	tokenBalance: number;
	isCanRedeemStashedTokens: boolean;
	transactions: Transaction[];
}

export interface Transaction {
	txId: string;
	recipient: string;
	amount: number;
	createdTimeStamp: number;
	reward: number;
	status: number;
}
