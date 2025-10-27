import { createHmac, Hmac, KeyObject, randomBytes, sign, timingSafeEqual } from 'crypto';

import { SessionToken } from '@shared/json'
import { sessionTokenLifetime } from '@shared/security'

const tokenNonceLength = 32;

export class SessionAuthority {
    privateKey: KeyObject;

    constructor(privateKey: KeyObject) {
        this.privateKey = privateKey;
    }

    private generateSecureRandomString = (length: number): string => {
        return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    }

    private generateSignature = (data: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> => {
        const hmac = createHmac('sha256', this.privateKey);
        hmac.update(data);
        return hmac.digest();
    }

    private verifySignature = (data: Buffer<ArrayBufferLike>, claimedSignature: Buffer<ArrayBufferLike>): boolean => {
        const actualSignature = this.generateSignature(data);
        return timingSafeEqual(actualSignature, claimedSignature);
    }

    public verifyAndDecodeToken = (encodedToken: string): SessionToken | null => {
        try {
            const encodedParts = encodedToken.split('.');
            if (encodedParts.length != 2) return null;

            const bodyBuffer = Buffer.from(encodedParts[0], 'base64');
            const body = JSON.parse(bodyBuffer.toString('utf8')) as SessionToken;

            // verify timestamp
            const timestampString = body.timestamp;
            if (timestampString == undefined) return null;
            const timestamp = new Date(timestampString);
            if (isNaN(timestamp.getTime())) return null;
            if (new Date().getTime() - timestamp.getTime() > (sessionTokenLifetime * 3600000)) return null;

            // verify signature
            const claimedSignatureBuffer = Buffer.from(encodedParts[1], 'base64');
            if (!this.verifySignature(bodyBuffer, claimedSignatureBuffer)) return null;

            return body;
        } catch (e: unknown) {
            console.log(`An error occurred while trying to verify token: ${e}`);
            return null;
        }
    }

    public signAndEncodeToken = (token: SessionToken): string => {
        (token as any).nonce = this.generateSecureRandomString(tokenNonceLength);
        
        const bodyBuffer = Buffer.from(JSON.stringify(token), 'utf8');
        const signatureBuffer = this.generateSignature(bodyBuffer);

        const encodedBody = bodyBuffer.toString('base64');
        const encodedSignature = signatureBuffer.toString('base64');

        return `${encodedBody}.${encodedSignature}`;
    }
}
