import { Router } from "express";
import { Mongoose } from "mongoose";

import { TokenAuthority } from "../security/token-authority";
import { AuthMiddleware } from "../middleware/auth-middleware";

import { UserDao } from "../daos/user-dao";
import { PoolDao } from "../daos/pool-dao";
import { TransactionDao } from "../daos/transaction-dao";
import { getAuthRouter } from "./auth";
import { getUserRouter } from "./user";
import { getPoolRouter } from "./pool";
import { getTransactionRouter } from "./transactions";

export const getApiRouter = (sessionAuthority: TokenAuthority, db: Mongoose): Router => {
    const api = Router();

    const userDao = new UserDao(db);
    const poolDao = new PoolDao(db);
    const transactionDao = new TransactionDao(db);

    api.use("/auth", getAuthRouter(sessionAuthority, userDao));

    const authMiddleware = new AuthMiddleware(sessionAuthority);
    api.use("/user", authMiddleware.ensureAuthenticated, getUserRouter(userDao));
    api.use("/pool", authMiddleware.ensureAuthenticated, getPoolRouter(poolDao));
    api.use("/transaction", authMiddleware.ensureAuthenticated, getTransactionRouter(transactionDao));

    return api;
}
