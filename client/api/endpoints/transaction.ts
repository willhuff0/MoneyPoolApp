import * as Protocol from "@money-pool-app/shared";
import { AxiosInstance } from "axios";

export const getTransactions = (client: AxiosInstance) => async (poolId: string, start?: number, count?: number): Promise<Protocol.Transaction[] | null> => {
    const response = await client.post(Protocol.transactionGetTransactionsEndpoint, {
        poolId: poolId,
        start: start,
        count: count,
    } as Protocol.TransactionGetTransactionsRequest);
    if (response.status !== 200) return null;

    const body = response.data as Protocol.TransactionGetTransactionsResponse;
    return body.transactions;
}

export const createTransaction = (client: AxiosInstance) => async (poolId: string, amount: number, description: string): Promise<string | null> => {
    const response = await client.post(Protocol.transactionCreateTransactionEndpoint, {
        poolId: poolId,
        amount: amount,
        description: description,
    } as Protocol.TransactionCreateTransactionRequest);
    if (response.status !== 200) return null;

    const body = response.data as Protocol.TransactionCreateTransactionResponse;
    return body.transactionId;
}

export const deleteTransaction = (client: AxiosInstance) => async (transactionId: string): Promise<boolean> => {
    const response = await client.post(Protocol.transactionDeleteTransactionEndpoint, {
        transactionId: transactionId,
    } as Protocol.TransactionDeleteTransactionRequest);
    return response.status === 200;
}
