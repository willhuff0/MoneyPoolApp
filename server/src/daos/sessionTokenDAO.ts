import type { ClientSession, ProjectionType, QueryOptions, UpdateQuery, InferSchemaType, FilterQuery } from "mongoose";
import { BaseDAO } from "./baseDAO";
import { SessionToken } from "../models";

type SessionTokenDoc = InferSchemaType<typeof SessionToken.schema>;

export class SessionTokenDAO extends BaseDAO<SessionTokenDoc> {
  constructor() { super(SessionToken as any); }

  async findByEncoded(encoded: string, projection?: ProjectionType<any>, options: QueryOptions = {}) {
    return this.model.findOne({ encoded }, projection, options).lean().exec();
  }

  async findActiveByUser(userId: string, projection?: ProjectionType<any>, options: QueryOptions = {}) {
    const now = new Date();
    return this.model.findOne({ userId, revokedAt: { $exists: false }, expiresAt: { $gt: now } }, projection, options).lean().exec();
  }

  async touch(id: string, when: Date = new Date(), session?: ClientSession) {
    return this.model.findByIdAndUpdate(id, { $set: { lastUsedAt: when } }, { new: true, session: session ?? undefined }).lean().exec();
  }

  async revokeById(id: string, when: Date = new Date(), session?: ClientSession) {
    return this.model.findByIdAndUpdate(id, { $set: { revokedAt: when } }, { new: true, session: session ?? undefined }).lean().exec();
  }

  async revokeByUser(userId: string, when: Date = new Date(), session?: ClientSession) {
    return this.model.updateMany({ userId, revokedAt: { $exists: false } }, { $set: { revokedAt: when } }, { session: session ?? undefined }).exec();
  }

  async deleteExpired(now: Date = new Date(), session?: ClientSession) {
    return this.model.deleteMany({ $or: [{ expiresAt: { $lte: now } }, { revokedAt: { $exists: true } }] }, { session: session ?? undefined }).exec();
  }

  async updateToken(filter: FilterQuery<SessionTokenDoc>, update: UpdateQuery<SessionTokenDoc>, options: QueryOptions = {}) {
    return this.model.findOneAndUpdate(filter, update, { ...options, new: true }).lean().exec();
  }
}
