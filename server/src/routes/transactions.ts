import { Router } from "express";

import { transactionCreateTransactionEndpoint, transactionDeleteTransactionEndpoint, transactionGetTransactionsEndpoint } from "@money-pool-app/shared";

import { TransactionDao } from "../daos/transaction-dao";
import { TransactionController } from "../controllers/transaction-controller";

const removePrefix = (fullPath: string): string => {
    const secondSlashIndex = fullPath.indexOf('/', 1);
    return secondSlashIndex === -1 ? '/' : fullPath.substring(secondSlashIndex);
};

export const getTransactionRouter = (transactionDao: TransactionDao): Router => {
    const router = Router();

    const controller = new TransactionController(transactionDao);

    router.all(removePrefix(transactionGetTransactionsEndpoint), controller.getTransactions);
    router.all(removePrefix(transactionCreateTransactionEndpoint), controller.createTransaction);
    router.all(removePrefix(transactionDeleteTransactionEndpoint), controller.deleteTransaction);

    return router;
}
