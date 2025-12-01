import { Router } from "express";

import { userAcceptFriendRequestEndpoint, userCreateFriendRequestEndpoint, userDeleteFriendEndpoint, userDeleteFriendRequestEndpoint, userEditUserEndpoint, userGetUserEndpoint, userSearchUserEndpoint } from "@money-pool-app/shared";

import { UserDao } from "../daos/user-dao";
import { UserController } from "../controllers/user-controller";

const removePrefix = (fullPath: string): string => {
    const secondSlashIndex = fullPath.indexOf('/', 1);
    return secondSlashIndex === -1 ? '/' : fullPath.substring(secondSlashIndex);
};

export const getUserRouter = (userDao: UserDao): Router => {
    const router = Router();

    const controller = new UserController(userDao);

    router.all(removePrefix(userGetUserEndpoint), controller.getUser);
    router.all(removePrefix(userEditUserEndpoint), controller.editUser);
    router.all(removePrefix(userSearchUserEndpoint), controller.searchUser);
    router.all(removePrefix(userCreateFriendRequestEndpoint), controller.createFriendRequest);
    router.all(removePrefix(userDeleteFriendRequestEndpoint), controller.deleteFriendRequest);
    router.all(removePrefix(userAcceptFriendRequestEndpoint), controller.acceptFriendRequest);
    router.all(removePrefix(userDeleteFriendEndpoint), controller.deleteFriend);

    return router;
}
