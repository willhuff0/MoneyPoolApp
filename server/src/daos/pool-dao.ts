import { Mongoose } from "mongoose";
import { PoolModel, PoolDocument, UserModel } from "../models"

export class PoolDao {
    db: Mongoose;

    constructor(db: Mongoose) {
        this.db = db;
    }

    public readonly createPool = async (poolId: string, name: string, owner: string): Promise<void> => {
        const session = await this.db.startSession();
        try {
            const newPool = new PoolModel({
                _id: poolId,
                name,
                owner,
                members: {[owner]: 0},
                balance: 0,
            });
            await newPool.save({ session });

            await UserModel.findByIdAndUpdate(owner, {
                $addToSet: { pools: poolId },
            }, { session });
        } finally {
            await session.endSession();
        }
    }

    public readonly getPoolById = async (poolId: string): Promise<PoolDocument | null> => {
        return await PoolModel.findById(poolId);
    }

    public readonly addMember = async (checkOwnerId: string, poolId: string, userId: string): Promise<boolean> => {
        const session = await this.db.startSession();
        try {
            return await session.withTransaction(async () => {
                const pool = await PoolModel.findById(poolId).session(session);
                if (pool == null) return false;
                if (pool.owner !== checkOwnerId) return false;

                const userToAdd = await UserModel.findById(userId).session(session);
                if (userToAdd == null) return false;
                if (!userToAdd.friends.includes(checkOwnerId)) return false;

                pool.members.set(userId, 0);
                await pool.save({ session });

                await UserModel.findByIdAndUpdate(userId, {
                    $addToSet: { pools: poolId },
                }, { session });

                return true;
            });
        } finally {
            await session.endSession();
        }
    }

    public readonly removeMember = async (checkOwnerId: string, poolId: string, userId: string): Promise<boolean> => {
        const session = await this.db.startSession();
        try {
            return await session.withTransaction(async () => {
                const pool = await PoolModel.findById(poolId).session(session);
                if (pool == null) return false;
                if (pool.owner !== checkOwnerId) return false;

                pool.members.delete(userId);
                await pool.save({ session });

                await UserModel.findByIdAndUpdate(userId, {
                    $pull: { pools: poolId },
                }, { session });

                return true;
            });
        } finally {
            await session.endSession();
        }
    }

    public readonly deletePool = async (checkOwnerId: string, poolId: string): Promise<boolean> => {
        const session = await this.db.startSession();
        try {
            return await session.withTransaction(async () => {
                const pool = await PoolModel.findById(poolId).session(session);
                if (pool == null) return false;
                if (pool.owner !== checkOwnerId) return false;

                for (const member of Object.keys(pool.members)) {
                    await UserModel.findByIdAndUpdate(member, {
                        $pull: { pools: poolId },
                    }, { session });
                }

                await pool.deleteOne({ session });

                return true;
            });
        } finally {
            await session.endSession();
        }
    }
}
