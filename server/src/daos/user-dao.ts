import { DbUser } from 'src/models';

export class UserNameTakenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserNameTakenError';
    }
}

export class UserDao {
    public createUser = async (userId: string, userName: string, email: string, displayName: string, passwordDigest: string): Promise<void> => {
        
    }

    public getUserById = async (userId: string): Promise<DbUser | null> => {
        return null;
    }

    public getUserByUserName = async (userName: string): Promise<DbUser | null> => {
        return null;
    }

    public getUserByEmail = async (email: string): Promise<DbUser | null> => {
        return null;
    }
}