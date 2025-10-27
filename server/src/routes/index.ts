import { Router } from "express";

import { SessionAuthority } from "../security/session-authority";
import { AuthMiddleware } from "../middleware/auth-middleware";

import { getAuthRouter } from "./auth";
// import userRoutes from "./users.js";
// import groupRoutes from "./groups.js";
// import transactionRoutes from "./transactions.js";

export const getApiRouter = (sessionAuthority: SessionAuthority): Router => {
    const api = Router();

    api.use("/auth", getAuthRouter(sessionAuthority));

    const authMiddleware = new AuthMiddleware(sessionAuthority);
    api.all('/test', authMiddleware.ensureAuthenticated, (req, res) => {
        res.status(200).json({ message: "Working!" });
    });
    // api.use("/users", userRoutes);
    // api.use("/groups", groupRoutes);
    // api.use("/", transactionRoutes);

    return api;
}
