export interface JsonSessionToken {
    userId: string,
    displayName: string,
    timestamp: Date,
    ip: string,
    claims: string[],
}