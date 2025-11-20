import { mongo } from "mongoose";
import { PoolModel, PoolDocument } from "../models"

export class PoolDao {
    session: mongo.ClientSession;

    constructor(session: mongo.ClientSession) {
        this.session = session;
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
        return await this.session.withTransaction(async () => {
            const pool = await PoolModel.findById(poolId);
            if (pool == null) return false;
            if (pool.owner !== checkOwnerId) return false;

            await pool.updateOne(
                { $addToSet: { members: userId } },
            );
            return true;
        });
    }

    public readonly removeMember = async (checkOwnerId: string, poolId: string, userId: string): Promise<boolean> => {
        return await this.session.withTransaction(async () => {
            const pool = await PoolModel.findById(poolId);
            if (pool == null) return false;
            if (pool.owner !== checkOwnerId) return false;

            await pool.updateOne(
                { $pull: { members: userId } },
            );
            return true;
        });
    }

    public readonly deletePool = async (checkOwnerId: string, poolId: string): Promise<boolean> => {
        return await this.session.withTransaction(async () => {
            const pool = await PoolModel.findById(poolId);
            if (pool == null) return false;
            if (pool.owner !== checkOwnerId) return false;

            await pool.deleteOne();
            return true;
        });
    }
}
