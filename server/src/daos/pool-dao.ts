import { Mongoose } from "mongoose";
import { PoolModel, PoolDocument } from "../models"

export class PoolDao {
    db: Mongoose;

    constructor(db: Mongoose) {
        this.db = db;
    }

    public readonly createPool = async (poolId: string, name: string, owner: string): Promise<void> => {
        const newPool = new PoolModel({
            _id: poolId,
            name,
            owner,
            members: [owner],
            balance: 0,
        });

        await newPool.save();
    }

    public readonly getPoolById = async (poolId: string): Promise<PoolDocument | null> => {
        return await PoolModel.findById(poolId);
    }

    public readonly addMember = async (checkOwnerId: string, poolId: string, userId: string): Promise<boolean> => {
        const session = await this.db.startSession();
        try {
            return await session.withTransaction(async () => {
                const pool = await PoolModel.findById(poolId, { session });
                if (pool == null) return false;
                if (pool.owner !== checkOwnerId) return false;

                await pool.updateOne({
                    $addToSet: { members: userId }
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
                const pool = await PoolModel.findById(poolId, { session });
                if (pool == null) return false;
                if (pool.owner !== checkOwnerId) return false;

                await pool.updateOne({
                    $pull: { members: userId }
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
                const pool = await PoolModel.findById(poolId, { session });
                if (pool == null) return false;
                if (pool.owner !== checkOwnerId) return false;

                await pool.deleteOne({ session });
                return true;
            });
        } finally {
            await session.endSession();
        }
    }
}
