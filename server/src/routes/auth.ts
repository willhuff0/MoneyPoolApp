import { Router } from "express";

import { AuthController } from "../controllers/auth-controller";
import { UserDao } from "../daos/user-dao";
import { SessionAuthority } from "../security/session-authority";

export const getAuthRouter = (sessionAuthority: SessionAuthority): Router => {
    const router = Router();

    const userDao = new UserDao();
    const controller = new AuthController(userDao, sessionAuthority);

    router.all("/createUser", controller.createUser);
    router.all("/startSession", controller.startSession);

    return router;
}
