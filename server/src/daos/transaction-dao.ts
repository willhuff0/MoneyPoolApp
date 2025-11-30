import { mongo } from "mongoose";
import { PoolModel, TransactionDocument, TransactionModel } from "../models"

export class TransactionDao {
    session: mongo.ClientSession;

    constructor(session: mongo.ClientSession) {
        this.session = session;
    }
    
    public readonly createTransaction = async (transactionId: string, poolId: string, userId: string, timestamp: Date, amount: number, description: string): Promise<boolean> => {
        return await this.session.withTransaction(async () => {
            const pool = await PoolModel.findById(poolId);
            if (pool == null) return false;
            if (!pool.members.includes(userId)) return false;

            await TransactionModel.create({
                _id: transactionId,
                poolId,
                userId,
                timestamp,
                amount,
                description,
            });
            return true;
        });
    }

    public readonly deleteTransaction = async (transactionId: string, checkUserId: string): Promise<boolean> => {
        return await this.session.withTransaction(async () => {
            const transaction = await TransactionModel.findById(transactionId);
            if (transaction == null) return false;

            if (transaction.userId !== checkUserId) {
                const pool = await PoolModel.findById(transaction.poolId);
                if (pool == null) return false;
                if (pool.owner !== checkUserId) return false;
            }

            await transaction.deleteOne();
            return true;
        });
    }

    public readonly getTransactions = async (poolId: string, start: number, count: number): Promise<TransactionDocument[]> => {
        return await TransactionModel.find({
            poolId,
        })
            .skip(start)
            .limit(count)
            .exec();
    }
}