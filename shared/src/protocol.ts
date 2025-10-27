export interface ErrorResponse {
    code?: number,
    message: string,
}

export interface AuthCreateUserRequest {
    displayName: string,
    userName: string,
    email: string,
    password: string,
}
export interface AuthCreateUserResponse {
    token: string,
}

export interface AuthStartSessionRequest {
    userName?: string,
    email?: string,
    password: string,
}
export interface AuthStartSessionResponse {
    token: string,
    email: string,
    userName: string,
    displayName: string,
    chompScore: number,
}