import { PoolModel, PoolDocument } from "../models"
import { Types } from "mongoose"

export class PoolDao {
    public readonly createGroup = async (groupId: string, name: string, owner: string): Promise<void> => {
        const newPool = new PoolModel({
            _id: groupId,
            name,
            owner,
            members: [owner],
            balance: 0,
        });

        await newPool.save();
    }

    public readonly getPoolById = async (groupId: string): Promise<PoolDocument | null> => {
        return await PoolModel.findById(new Types.ObjectId(groupId));
    }

    public readonly addMember = async (groupId: string, userId: string): Promise<void> => {
        await PoolModel.findByIdAndUpdate(groupId,
            { $addToSet: { members: userId } },
        );
    }

    public readonly removeMember = async (groupId: string, userId: string): Promise<void> => {
        await PoolModel.findByIdAndUpdate(groupId,
            { $pull: { members: userId } },
        );
    }

    public readonly deleteGroup = async (groupId: string): Promise<void> => {
        await PoolModel.findByIdAndDelete(groupId);
    }
}
