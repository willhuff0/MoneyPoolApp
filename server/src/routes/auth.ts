import { Router } from "express";

import { AuthController } from "../controllers/auth-controller";
import { UserDao } from "../daos/user-dao";
import { TokenAuthority } from "../security/token-authority";

export const getAuthRouter = (sessionAuthority: TokenAuthority, userDao: UserDao): Router => {
    const router = Router();

    const controller = new AuthController(userDao, sessionAuthority);

    router.all('/doesUserExist', controller.doesUserExist);
    router.all('/createUser', controller.createUser);
    router.all('/signIn', controller.signIn);
    router.all('/refresh', controller.refresh);
    router.all('/invalidateTokens', controller.invalidateTokens);

    return router;
}
