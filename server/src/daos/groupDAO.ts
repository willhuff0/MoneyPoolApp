import type { ClientSession, FilterQuery, ProjectionType, QueryOptions, UpdateQuery, InferSchemaType } from "mongoose";
import { BaseDAO } from "./baseDAO";
import { Group } from "../models";

type GroupDoc = InferSchemaType<typeof Group.schema>;

export class GroupDAO extends BaseDAO<GroupDoc> {
  constructor() { super(Group as any); }

  async findByName(name: string, projection?: ProjectionType<any>, options: QueryOptions = {}) {
    return this.model.findOne({ name }, projection, options).lean().exec();
  }

  async addMember(groupId: string, userId: string, session?: ClientSession) {
    return this.model
      .findByIdAndUpdate(groupId, { $addToSet: { members: userId } }, { session: session ?? undefined, new: true })
      .lean()
      .exec();
  }

  async removeMember(groupId: string, userId: string, session?: ClientSession) {
    return this.model
      .findByIdAndUpdate(groupId, { $pull: { members: userId } }, { session: session ?? undefined, new: true })
      .lean()
      .exec();
  }

  async updateGroup(filter: FilterQuery<any>, update: UpdateQuery<any>, options: QueryOptions = {}) {
    return this.model.findOneAndUpdate(filter, update, { ...options, new: true }).lean().exec();
  }

  async deleteGroup(filter: FilterQuery<any>, session?: ClientSession) {
    return this.model.deleteOne(filter, { session: session ?? undefined }).exec();
  }
}
