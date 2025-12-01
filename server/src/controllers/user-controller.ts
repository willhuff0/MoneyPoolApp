import { Request, Response } from "express";
import { UserDao, UserNotUniqueError } from "../daos/user-dao";

import { validateDisplayName, validateEmail, validatePassword } from "@money-pool-app/shared";
import * as Protocol from '@money-pool-app/shared';

import { HashedUserPassword } from "../security/hashed-user-password";

export class UserController {
    userDao: UserDao;

    constructor(userDao: UserDao) {
        this.userDao = userDao;
    }

    public readonly getUser = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.UserGetUserRequest = req.body;

        if (body?.userId == undefined) {
            // Get self user
            const sessionToken = req.sessionToken!;

            const user = await this.userDao.getUserById(sessionToken.userId);
            if (user == null) {
                res.status(404).json({ message: "User not found" } as Protocol.ErrorResponse);
                return;
            }
            
            res.status(200).json({
                user: {
                    userId: user._id,
                    email: user.email,
                    userName: user.userName,
                    displayName: user.displayName,
                    chompScore: user.chompScore,
                }
            } as Protocol.UserGetSelfUserResponse);
            return;
        }

        const user = await this.userDao.getUserById(body.userId);
        if (user == null) {
            res.status(404).json({ message: "User not found" } as Protocol.ErrorResponse);
            return;
        }
        
        res.status(200).json({
            user: {
                userId: user._id,
                userName: user.userName,
                displayName: user.displayName,
                chompScore: user.chompScore,
            },
        } as Protocol.UserGetUserResponse);
    }

    public readonly editUser = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.UserEditUserRequest = req.body ?? {};
        const sessionToken = req.sessionToken!;

        if (body.newDisplayName == undefined && body.newEmail == undefined && body.newPassword == undefined) {
            res.status(400).json({ message: "At least one field required" } as Protocol.ErrorResponse);
            return;
        }

        if (body.newDisplayName != undefined && !validateDisplayName(body.newDisplayName)) {
            res.status(400).json({ message: "displayName failed validation" } as Protocol.ErrorResponse);
            return;
        }
        if (body.newEmail != undefined && !validateEmail(body.newEmail)) {
            res.status(400).json({ message: "email failed validation" } as Protocol.ErrorResponse);
            return;
        }
        if (body.newPassword != undefined && !validatePassword(body.newPassword)) {
            res.status(400).json({ message: "password failed validation" } as Protocol.ErrorResponse);
            return;
        }

        const newHashedUserPassword = body.newPassword == undefined ? undefined :  await HashedUserPassword.createNew(body.newPassword);

        try {
            await this.userDao.editUser(
                sessionToken.userId,
                body.newDisplayName,
                body.newEmail,
                newHashedUserPassword?.digest,
            );
        } catch(e) {
            if (e instanceof UserNotUniqueError) {
                res.status(403).json({ code: 1, message: "email is already taken" } as Protocol.ErrorResponse);
                return;
            }

            console.log(`Error occurred in user dao: ${e}`);
            res.status(500).end();
            return;
        }

        res.status(200).end();
    }

    public readonly searchUser = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.UserSearchUserRequest = req.body;

        const user = await this.userDao.getUserByUserName(body.query);
        if (user == null) {
            res.status(404).json({ message: "User not found" } as Protocol.ErrorResponse);
            return;
        }
        
        res.status(200).json({
            users: [
                {
                    userId: user._id,
                    userName: user.userName,
                    displayName: user.displayName,
                    chompScore: user.chompScore,
                },
            ],
        } as Protocol.UserSearchUserResponse);
    }

    public readonly createFriendRequest = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.UserCreateFriendRequestRequest = req.body;
        const sessionToken = req.sessionToken!;

        if (!await this.userDao.createFriendRequest(sessionToken.userId, body.otherUserId)) {
            res.status(404).json({ message: "Other user not found or an error occurred" } as Protocol.ErrorResponse);
            return;
        }

        res.status(200).end();
    }

    public readonly deleteFriendRequest = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.UserCreateFriendRequestRequest = req.body;
        const sessionToken = req.sessionToken!;

        await this.userDao.deleteFriendRequest(sessionToken.userId, body.otherUserId)
        res.status(200).end();
    }

    public readonly acceptFriendRequest = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.UserCreateFriendRequestRequest = req.body;
        const sessionToken = req.sessionToken!;

        if (!await this.userDao.acceptFriendRequest(sessionToken.userId, body.otherUserId)) {
            res.status(404).json({ message: "Other user not found or an error occurred" } as Protocol.ErrorResponse);
            return;
        }

        res.status(200).end();
    }
}