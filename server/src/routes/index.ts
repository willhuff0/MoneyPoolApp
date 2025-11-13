import { Router } from "express";
import { mongo } from "mongoose";

import { TokenAuthority } from "../security/token-authority";
import { AuthMiddleware } from "../middleware/auth-middleware";

import { getAuthRouter } from "./auth";
import { UserDao } from "../daos/user-dao";
import { getUserRouter } from "./user";

export const getApiRouter = (sessionAuthority: TokenAuthority, dbSession: mongo.ClientSession): Router => {
    const api = Router();

    const userDao = new UserDao(dbSession);

    api.use("/auth", getAuthRouter(sessionAuthority, userDao));

    const authMiddleware = new AuthMiddleware(sessionAuthority);
    api.use("/user", authMiddleware.ensureAuthenticated, getUserRouter(userDao));

    return api;
}
