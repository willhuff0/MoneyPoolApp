import { Mongoose } from "mongoose";
import { PoolModel, TransactionDocument, TransactionModel } from "../models"

export class TransactionDao {
    db: Mongoose;

    constructor(db: Mongoose) {
        this.db = db;
    }
    
    public readonly createTransaction = async (transactionId: string, poolId: string, userId: string, timestamp: Date, amount: number, description: string): Promise<boolean> => {
        const session = await this.db.startSession();
        try {
            return await session.withTransaction(async () => {
                const pool = await PoolModel.findById(poolId).session(session);
                if (pool == null) return false;
                
                const userBalance = pool.members.get(userId);
                if (userBalance == undefined) return false;

                pool.members.set(userId, userBalance + amount);
                pool.balance += amount;
                await pool.save({ session });
                
                const newTransaction = new TransactionModel({
                    _id: transactionId,
                    poolId,
                    userId,
                    timestamp,
                    amount,
                    description,
                });
                await newTransaction.save({ session });
                return true;
            });
        } finally {
            await session.endSession();
        }
    }

    public readonly deleteTransaction = async (transactionId: string, checkUserId: string): Promise<boolean> => {
        const session = await this.db.startSession();
        try {
            return await session.withTransaction(async () => {
                const transaction = await TransactionModel.findById(transactionId).session(session);
                if (transaction == null) return false;

                const pool = await PoolModel.findById(transaction.poolId).session(session);
                if (pool == null) return false;

                if (transaction.userId !== checkUserId && pool.owner !== checkUserId) return false;

                const userBalance = pool.members.get(transaction.userId);
                if (userBalance == undefined) return false;

                pool.members.set(transaction.userId, userBalance - transaction.amount);
                pool.balance -= transaction.amount;
                await pool.save({ session });

                await transaction.deleteOne({ session });
                return true;
            });
        } finally {
            await session.endSession();
        }
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