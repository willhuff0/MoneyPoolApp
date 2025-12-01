export interface SessionToken {
    userId: string,
    timestamp: string,
    claims: string[],
}

export interface RefreshToken {
    userId: string,
    timestamp: string,
}

export interface User {
    userId: string,
    userName: string,
    displayName: string,
    chompScore: number,
}

export interface Pool {
    poolId: string,
    displayName: string,
    ownerUserId: string,
    members: { [userId: string]: number },
    balance: number,
}

export interface Transaction {
    transactionId: string,
    poolId: string,
    userId: string,
    timestamp: string,
    amount: number,
    description: string,
}
