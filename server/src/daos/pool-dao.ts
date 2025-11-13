import { PoolModel, PoolDocument } from "../models"

export class PoolDao {
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

    public readonly addMember = async (poolId: string, userId: string): Promise<void> => {
        await PoolModel.findByIdAndUpdate(poolId,
            { $addToSet: { members: userId } },
        );
    }

    public readonly removeMember = async (poolId: string, userId: string): Promise<void> => {
        await PoolModel.findByIdAndUpdate(poolId,
            { $pull: { members: userId } },
        );
    }

    public readonly deleteGroup = async (poolId: string): Promise<void> => {
        await PoolModel.findByIdAndDelete(poolId);
    }
}
