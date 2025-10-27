import type {
  ClientSession,
  HydratedDocument,
  Model,
  ProjectionType,
  Types,
} from "mongoose";
import { BaseDAO } from "./baseDAO";
import { Transaction } from "../models"; 

export type TransactionAttrs = {
  transaction_id: number;
  group_id: Types.ObjectId;    
  user_id: Types.ObjectId;      
  amount: number;   
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TransactionDocument = HydratedDocument<TransactionAttrs>;
export type TransactionLean = TransactionAttrs & { _id: Types.ObjectId };

const TransactionModel = Transaction as unknown as Model<TransactionDocument>;

export class TransactionDAO extends BaseDAO<TransactionDocument, TransactionLean> {
  constructor() {
    super(TransactionModel);
  }

  findByTransactionId(
    transaction_id: number,
    projection?: ProjectionType<TransactionDocument>
  ) {
    return this.findOne({ transaction_id } as any, projection);
  }

  listByGroup(groupObjectId: Types.ObjectId | string) {
    return this.findMany(
      { group_id: groupObjectId as any } as any,
      undefined,
      { sort: { createdAt: -1 } }
    );
  }

  listByUser(userObjectId: Types.ObjectId | string) {
    return this.findMany(
      { user_id: userObjectId as any } as any,
      undefined,
      { sort: { createdAt: -1 } }
    );
  }

  async createTransaction(
    input: Pick<TransactionAttrs, "transaction_id" | "group_id" | "user_id" | "amount" | "description">,
    session?: ClientSession | null
  ) {
    return this.create({ ...input } as any, session);
  }

  async updateTransaction(
    txObjectId: Types.ObjectId | string,
    updates: Partial<Pick<TransactionAttrs, "amount" | "description">>,
    session?: ClientSession | null
  ) {
    const safe: Partial<TransactionAttrs> = {};
    if (typeof updates.amount === "number") safe.amount = updates.amount;
    if (typeof updates.description === "string") safe.description = updates.description;

    return this.updateById(
      txObjectId as any,
      { $set: safe } as any,
      { session: session || undefined }
    );
  }

  async deleteByTransactionId(transaction_id: number, session?: ClientSession | null) {
    const res = await TransactionModel.findOneAndDelete(
      { transaction_id } as any,
      { session: session || undefined }
    ).lean().exec();
    return !!res;
  }


  async totalSpentByUserInGroup(
    userObjectId: Types.ObjectId | string,
    groupObjectId: Types.ObjectId | string
  ): Promise<number> {
    const rows = await TransactionModel.aggregate([
      { $match: { user_id: new (require("mongoose").Types.ObjectId)(userObjectId), group_id: new (require("mongoose").Types.ObjectId)(groupObjectId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).exec();
    return (rows?.[0]?.total ?? 0) as number;
  }

  async totalSpentPerMemberInGroup(
    groupObjectId: Types.ObjectId | string
  ): Promise<{ user_id: Types.ObjectId; total: number }[]> {
    const rows = await TransactionModel.aggregate([
      { $match: { group_id: new (require("mongoose").Types.ObjectId)(groupObjectId) } },
      { $group: { _id: "$user_id", total: { $sum: "$amount" } } },
      { $project: { _id: 0, user_id: "$_id", total: 1 } },
      { $sort: { total: -1 } },
    ]).exec();
    return rows as any;
  }
}

export const transactionDAO = new TransactionDAO();
