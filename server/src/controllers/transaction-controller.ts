import { Request, Response } from "express";
import { v7 as uuidv7 } from 'uuid';

import { validateTransactionDescription } from "@money-pool-app/shared";
import * as Protocol from '@money-pool-app/shared';

import { TransactionDao } from "../daos/transaction-dao";

export class TransactionController {
    transactionDao: TransactionDao;

    constructor(transactionDao: TransactionDao) {
        this.transactionDao = transactionDao;
    }

    public readonly getTransactions = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.TransactionGetTransactionsRequest = req.body;

        const start = Math.max(body.start ?? 0, 0);
        const limit = Math.max(Math.min(body.limit ?? 10, 10), 0);
        const transactions = await this.transactionDao.getTransactions(body.poolId, start, limit);
        
        res.status(200).json({
            transactions: transactions.map((value) => {
                return {
                    transactionId: value._id,
                    poolId: value.poolId,
                    userId: value.userId,
                    timestamp: value.timestamp.toISOString(),
                    amount: value.amount,
                    description: value.description,
                } as Protocol.Transaction;
            }),
        } as Protocol.TransactionGetTransactionsResponse);
    }

    public readonly createTransaction = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.TransactionCreateTransactionRequest = req.body;
        const sessionToken = req.sessionToken!;

        if (body.amount <= 0) {
            res.status(400).json({ message: "amount must greater than 0" } as Protocol.ErrorResponse);
            return;
        }
        if (!validateTransactionDescription(body.description)) {
            res.status(400).json({ message: "description failed validation" } as Protocol.ErrorResponse);
            return;
        }

        const transactionId = uuidv7();
        const timestamp = new Date();

        if (!await this.transactionDao.createTransaction(transactionId, body.poolId, sessionToken.userId, timestamp, body.amount, body.description)) {
            res.status(400).json({ message: "Pool does not exist or the user is not a member" } as Protocol.ErrorResponse);
            return;
        }

        res.status(200).json({
            transactionId: transactionId,
        } as Protocol.TransactionCreateTransactionResponse);
    }

    public readonly deleteTransaction = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.TransactionDeleteTransactionRequest = req.body;
        const sessionToken = req.sessionToken!;
        
        if (!await this.transactionDao.deleteTransaction(body.transactionId, sessionToken.userId)) {
            res.status(400).json({ message: "Transaction does not exist or the user did not create the transaction and the user is not the pool owner" } as Protocol.ErrorResponse);
            return;
        }

        res.status(200).end();
    }
}