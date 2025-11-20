import { Router } from "express";
import { mongo } from "mongoose";

import { TokenAuthority } from "../security/token-authority";
import { AuthMiddleware } from "../middleware/auth-middleware";

import { UserDao } from "../daos/user-dao";
import { PoolDao } from "../daos/pool-dao";
import { getAuthRouter } from "./auth";
import { getUserRouter } from "./user";
import { getPoolRouter } from "./pool";

export const getApiRouter = (sessionAuthority: TokenAuthority, dbSession: mongo.ClientSession): Router => {
    const api = Router();

    const userDao = new UserDao(dbSession);
    const poolDao = new PoolDao(dbSession);

    api.use("/auth", getAuthRouter(sessionAuthority, userDao));

    const authMiddleware = new AuthMiddleware(sessionAuthority);
    api.use("/user", authMiddleware.ensureAuthenticated, getUserRouter(userDao));
    api.use("/pool", authMiddleware.ensureAuthenticated, getPoolRouter(poolDao));

    return api;
}
