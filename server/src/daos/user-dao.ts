import { defaultChompScore } from '@money-pool-app/shared';
import { UserModel, UserDocument } from '../models';

export class UserNotUniqueError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserNotUniqueError';
    }
}

export class UserDao {
    public createUser = async (userId: string, userName: string, email: string, displayName: string, passwordDigest: string, timestamp: Date): Promise<void> => {
        try {
            const newUser = new UserModel({
                _id: userId,
                userName: userName,
                email: email,
                displayName: displayName,
                passwordDigest: passwordDigest,
                allowRefreshTokensCreatedAfter: timestamp,
                groups: [],
                friends: [],
                incomingFriendRequests: [],
                chompScore: defaultChompScore,
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

    public getUserById = async (userId: string): Promise<UserDocument | null> => {
        return await UserModel.findById(userId);
    }

    public getUserByUserName = async (userName: string): Promise<UserDocument | null> => {
        return await UserModel.findOne({ userName: userName });
    }

    public getUserByEmail = async (email: string): Promise<UserDocument | null> => {
        return await UserModel.findOne({ email: email });
    }

    public invalidateUserTokens = async (userDocument: UserDocument): Promise<void> => {
        userDocument.allowRefreshTokensCreatedAfter = new Date();
        await userDocument.save();
    }
}
