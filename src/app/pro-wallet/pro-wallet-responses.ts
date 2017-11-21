export interface UserTransactionsHistoryResponse {
	stashedTokensBalance: number;
	tokenBalance: number;
	transactions: Transaction[];
}

export interface Transaction {
	txId: string;
	amount: number;
	createdTimeStamp: number;
	reward: number;
	status: number;
}
