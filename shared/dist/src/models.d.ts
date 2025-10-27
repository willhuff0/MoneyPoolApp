export interface SessionToken {
    userId: string;
    displayName: string;
    timestamp: Date;
    ip: string;
    claims: string[];
}
export interface User {
    userId: string;
    displayName: string;
    userName: string;
    chompScore: number;
}
export interface Pool {
    groupId: string;
    displayName: string;
    ownerUserId: string;
    members: string[];
    balance: number;
}
export interface Transaction {
    transactionId: string;
    groupId: string;
    userId: string;
    timestamp: Date;
    amount: number;
    description: string;
}
//# sourceMappingURL=models.d.ts.map