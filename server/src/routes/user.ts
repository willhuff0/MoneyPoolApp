import { Router } from "express";

import { UserDao } from "../daos/user-dao";
import { UserController } from "../controllers/user-controller";

export const getUserRouter = (userDao: UserDao): Router => {
    const router = Router();

    const controller = new UserController(userDao);

    router.all('/getUser', controller.getUser);
    router.all('/searchUser', controller.searchUser);
    router.all('/createFriendRequest', controller.createFriendRequest);
    router.all('/deleteFriendRequest', controller.deleteFriendRequest);
    router.all('/acceptFriendRequest', controller.acceptFriendRequest);

    return router;
}
