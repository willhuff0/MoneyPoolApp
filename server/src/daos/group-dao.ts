import { GroupModel, GroupDocument } from "../models"
import { Types } from "mongoose"

export class GroupNotUniqueError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GroupNotUniqueError';
    }
}

export class GroupDao {
    public createGroup = async (group_id: number, name: string, owner: Types.ObjectId, balance: number = 0): Promise<void> => {
        try {
            const newGroup = new GroupModel({
                group_id,
                name,
                owner,
                members: [owner],
                balance
            });

            await newGroup.save();
        } catch (e: any) {
            if (e.code === 11000) {
                const field = Object.keys(e.keyValue)[0];
                throw new GroupNotUniqueError(`Duplicate ${field}: A group with this ${field} already exists.`);
            } else {
                throw e;
            }
        }
    }

    public getGroupById = async (groupId: string): Promise<GroupDocument | null> => {
        return await GroupModel.findById(new Types.ObjectId(groupId));
    }

    public findByName = async (name: string): Promise<GroupDocument | null> => {
        return await GroupModel.findOne({ name });
    }

    public addMember = async (groupId: string, userId: string): Promise<GroupDocument | null> => {
        return await GroupModel.findByIdAndUpdate(
            new Types.ObjectId(groupId),
            { $addToSet: { members: new Types.ObjectId(userId) } },
            { new: true }
        );
    }

    public removeMember = async (groupId: string, userId: string): Promise<GroupDocument | null> => {
        return await GroupModel.findByIdAndUpdate(
            new Types.ObjectId(groupId),
            { $pull: { members: new Types.ObjectId(userId) } },
            { new: true }
        );
    }

    public updateGroup = async (groupId: string, updates: any): Promise<GroupDocument | null> => {
        return await GroupModel.findByIdAndUpdate(
            new Types.ObjectId(groupId),
            updates,
            { new: true }
        );
    }

    public deleteGroup = async (groupId: string): Promise<boolean> => {
        const result = await GroupModel.findByIdAndDelete(new Types.ObjectId(groupId));
        return !!result;
    }
}
