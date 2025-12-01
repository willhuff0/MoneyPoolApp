import { defaultChompScore } from '@money-pool-app/shared';
import { UserModel, UserDocument } from '../models';
import { mongo, Mongoose } from 'mongoose';

export class UserNotUniqueError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserNotUniqueError';
    }
}

export class UserDao {
    db: Mongoose;

    constructor(db: Mongoose) {
        this.db = db;
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

    public editUser = async (userId: string, newDisplayName?: string, newEmail?: string, newPasswordDigest?: string): Promise<void> => {
        try {
            await UserModel.findByIdAndUpdate(userId, {
                displayName: newDisplayName,
                email: newEmail,
                passwordDigest: newPasswordDigest,
            });
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
        const session = await this.db.startSession();
        try {
            return await session.withTransaction(async () => {
                const fromUser = await UserModel.findById(fromUserId).session(session);
                if (fromUser == undefined) return false;
                if (fromUser.friends.includes(toUserId)) return false;

                const toUser = await UserModel.findByIdAndUpdate(toUserId, {
                    $addToSet: { incomingFriendRequests: fromUserId },
                }, { session });
                return toUser != undefined;
            });
        } finally {
            await session.endSession();
        }
    }

    public readonly deleteFriendRequest = async (fromUserId: string, toUserId: string, session?: mongo.ClientSession): Promise<void> => {
        await UserModel.findByIdAndUpdate(toUserId, {
            $pull: { incomingFriendRequests: fromUserId },
        }, { session });
    }

    public readonly acceptFriendRequest = async (fromUserId: string, toUserId: string): Promise<boolean> => {
        const session = await this.db.startSession();
        try {
            return await session.withTransaction(async () => {
                const fromUser = await UserModel.findById(fromUserId).session(session);
                if (fromUser == undefined) {
                    this.deleteFriendRequest(fromUserId, toUserId, session);
                    return false;
                }

                const toUser = await UserModel.findById(toUserId).session(session);
                if (toUser == undefined) return false;
                
                toUser.friends.push(fromUserId);
                toUser.incomingFriendRequests = toUser.incomingFriendRequests.filter(userId => userId !== fromUserId);
                await toUser.save({ session });

                fromUser.friends.push(toUserId);
                await fromUser.save({ session });

                return true;
            });
        } finally {
            await session.endSession();
        }
    }
}
