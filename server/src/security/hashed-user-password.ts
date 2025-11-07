import * as argon2 from "argon2";

export class HashedUserPassword {
    digest: string;

    constructor(
        digest: string,
    ) {
        this.digest = digest;
    }

    static readonly createNew = async (password: string): Promise<HashedUserPassword> => {
        return new HashedUserPassword(await argon2.hash(password));
    }

    doesPasswordMatch = async (password: string): Promise<boolean> => {
        return await argon2.verify(this.digest, password);
    }
}