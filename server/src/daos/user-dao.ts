import { DbUser, DbUserModel } from '../models';

export class UserNotUniqueError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserNotUniqueError';
    }
}

export class UserDao {
    public createUser = async (userId: string, userName: string, email: string, displayName: string, passwordDigest: string): Promise<void> => {
        try {
            const newUser = new DbUserModel({
                _id: userId,
                userName: userName,
                email: email,
                displayName: displayName,
                passwordDigest: passwordDigest,
                groups: [],
                friends: [],
                incomingFriendRequests: [],
                chompScore: 0,
            });

            await newUser.save();
        } catch(e: any) {
            if (e.code === 11000) {
                // Duplicate key error
                const field = Object.keys(e.keyValue)[0];
                throw new UserNotUniqueError(`Duplicate ${field}: A user with this ${field} already exists.`);
            } else {
                throw e;
            }
        }
    }

    public getUserById = async (userId: string): Promise<DbUser | null> => {
        return await DbUserModel.findById(userId).lean();
    }

    public getUserByUserName = async (userName: string): Promise<DbUser | null> => {
        return await DbUserModel.findOne({ userName: userName }).lean();
    }

    public getUserByEmail = async (email: string): Promise<DbUser | null> => {
        return await DbUserModel.findOne({ email: email }).lean();
    }
}
