import { createHmac, createSecretKey, KeyObject, randomBytes, timingSafeEqual } from 'node:crypto';

import { RefreshToken, refreshTokenLifetime, SessionToken, sessionTokenLifetime } from '@money-pool-app/shared'

const tokenNonceLength = 32;

export class TokenAuthority {
    privateKey: KeyObject;

    constructor(privateKey?: KeyObject) {
        this.privateKey = privateKey ?? createSecretKey(process.env.PRIVATE_KEY ?? this.generateSecureRandomString(256), "utf8");
    }

    private readonly generateSecureRandomString = (length: number): string => {
        return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    }

    private readonly generateSignature = (data: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> => {
        const hmac = createHmac('sha256', this.privateKey);
        hmac.update(data);
        return hmac.digest();
    }

    private readonly verifySignature = (data: Buffer<ArrayBufferLike>, claimedSignature: Buffer<ArrayBufferLike>): boolean => {
        const actualSignature = this.generateSignature(data);
        return timingSafeEqual(actualSignature, claimedSignature);
    }

    private readonly verifyAndDecodeToken = (encodedToken: string, lifetime: number): any => {
        try {
            const encodedParts = encodedToken.split('.');
            if (encodedParts.length != 2) return null;

            const bodyBuffer = Buffer.from(encodedParts[0], 'base64');
            const body = JSON.parse(bodyBuffer.toString('utf8')) as RefreshToken;

            // verify timestamp
            const timestampString = body.timestamp;
            if (timestampString == undefined) return null;
            const timestamp = new Date(timestampString);
            if (Number.isNaN(timestamp.getTime())) return null;
            if (Date.now() - timestamp.getTime() > (lifetime * 3600000)) return null;

            // verify signature
            const claimedSignatureBuffer = Buffer.from(encodedParts[1], 'base64');
            if (!this.verifySignature(bodyBuffer, claimedSignatureBuffer)) return null;

            return body;
        } catch (e: unknown) {
            console.log(`An error occurred while trying to verify token: ${e}`);
            return null;
        }
    }

    public verifyAndDecodeRefreshToken = (encodedToken: string): RefreshToken | null => {
        return this.verifyAndDecodeToken(encodedToken, refreshTokenLifetime);
    }

    public verifyAndDecodeSessionToken = (encodedToken: string): SessionToken | null => {
        return this.verifyAndDecodeToken(encodedToken, sessionTokenLifetime);
    }

    public signAndEncodeToken = (token: any): string => {
        token.nonce = this.generateSecureRandomString(tokenNonceLength);
        
        const bodyBuffer = Buffer.from(JSON.stringify(token), 'utf8');
        const signatureBuffer = this.generateSignature(bodyBuffer);

        const encodedBody = bodyBuffer.toString('base64');
        const encodedSignature = signatureBuffer.toString('base64');

        return `${encodedBody}.${encodedSignature}`;
    }
}
