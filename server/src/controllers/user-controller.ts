import { Request, Response } from "express";
import { UserDao } from "../daos/user-dao";

import * as Protocol from '@money-pool-app/shared';

export class UserController {
    userDao: UserDao;

    constructor(userDao: UserDao) {
        this.userDao = userDao;
    }

    public readonly getUser = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.UserGetUserRequest = req.body;

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