export interface Transaction {
    transactionId: string,
    groupId: string,
    userId: string,
    timestamp: Date,
    amount: number,
    description: string,
}