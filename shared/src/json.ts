export interface SessionToken {
    userId: string,
    displayName: string,
    timestamp: string,
    ip: string,
    claims: string[],
}

export interface User {
    userId: string,
    displayName: string,
    userName: string,
    chompScore: number,
}

export interface Pool {
    groupId: string,
    displayName: string,
    ownerUserId: string,
    members: string[],
    balance: number,
}

export interface Transaction {
    transactionId: string,
    groupId: string,
    userId: string,
    timestamp: string,
    amount: number,
    description: string,
}
