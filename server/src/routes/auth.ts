import { Router } from "express";

import { AuthController } from "../controllers/auth-controller";
import { UserDao } from "../daos/user-dao";
import { TokenAuthority } from "../security/token-authority";
import { authCreateUserEndpoint, authInvalidateTokensEndpoint, authRefreshEndpoint, authSignInEndpoint } from "@money-pool-app/shared";

export const getAuthRouter = (sessionAuthority: TokenAuthority): Router => {
    const router = Router();

    const userDao = new UserDao();
    const controller = new AuthController(userDao, sessionAuthority);

    router.all('/doesUserExist', controller.doesUserExist);
    router.all('/createUser', controller.createUser);
    router.all('/signIn', controller.signIn);
    router.all('/refresh', controller.refresh);
    router.all('/invalidateTokens', controller.invalidateTokens);

    return router;
}
