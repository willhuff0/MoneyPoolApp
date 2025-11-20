import { defaultChompScore } from '@money-pool-app/shared';
import { UserModel, UserDocument } from '../models';
import { mongo } from 'mongoose';

export class UserNotUniqueError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserNotUniqueError';
    }
}

export class UserDao {
    session: mongo.ClientSession;

    constructor(session: mongo.ClientSession) {
        this.session = session;
    }

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

    public readonly createFriendRequest = async (fromUserId: string, toUserId: string): Promise<boolean> => {
        return await this.session.withTransaction(async () => {
            const fromUser = await UserModel.findById(fromUserId);
            if (fromUser == undefined) return false;
            if (fromUser.friends.includes(toUserId)) return false;

            const toUser = await UserModel.findByIdAndUpdate(toUserId, {
                $addToSet: { incomingFriendRequests: fromUserId },
            });
            return toUser != undefined;
        });
    }

    public readonly deleteFriendRequest = async (fromUserId: string, toUserId: string): Promise<void> => {
        await UserModel.findByIdAndUpdate(toUserId, {
            $pull: { incomingFriendRequests: fromUserId },
        });
    }

    public readonly acceptFriendRequest = async (fromUserId: string, toUserId: string): Promise<boolean> => {
        return await this.session.withTransaction(async () => {
            const fromUser = await UserModel.findById(fromUserId);
            if (fromUser == undefined) {
                this.deleteFriendRequest(fromUserId, toUserId);
                return false;
            }

            const toUser = await UserModel.findById(toUserId);
            if (toUser == undefined) return false;
            
            toUser.friends.push(fromUserId);
            toUser.incomingFriendRequests = toUser.incomingFriendRequests.filter(userId => userId !== fromUserId);
            toUser.save();

            fromUser.friends.push(toUserId);
            fromUser.save();

            return true;
        });
    }
}
