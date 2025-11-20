import { Request, Response } from 'express';
import { v7 as uuidv7 } from 'uuid';

import { validateDisplayName, validateEmail, validatePassword, validateUserName, defaultChompScore } from '@money-pool-app/shared';
import * as Protocol from '@money-pool-app/shared';

import { UserDao, UserNotUniqueError } from '../daos/user-dao';
import { HashedUserPassword } from '../security/hashed-user-password';
import { TokenAuthority } from '../security/token-authority';
import { UserDocument } from '../models'

export class AuthController {
    userDao: UserDao;
    sessionAuthority: TokenAuthority;

    constructor(userDao: UserDao, sessionAuthority: TokenAuthority) {
        this.userDao = userDao;
        this.sessionAuthority = sessionAuthority;
    }

    public doesUserExist = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.AuthDoesUserExistRequest = req.body;

        if (body.userName != undefined && body.email != undefined) {
            res.status(400).json({ message: "Only one of userName or email must be specified" });
            return;
        }

        let dbUser: UserDocument | null | undefined = undefined;
        if (body.userName != undefined) {
            if (!validateUserName(body.userName)) {
                res.status(400).json({ message: "userName failed validation" } as Protocol.ErrorResponse);
                return;
            }
            dbUser = await this.userDao.getUserByUserName(body.userName);
        }
        if (body.email != undefined) {
            if (!validateEmail(body.email)) {
                res.status(400).json({ message: "email failed validation" } as Protocol.ErrorResponse);
                return;
            }
            dbUser = await this.userDao.getUserByEmail(body.email);
        }
        if (dbUser === undefined) {
            res.status(400).json({ message: "One of userName or email must be specified" } as Protocol.ErrorResponse);
            return
        }

        res.status(200).json({
            userExists: dbUser != null,
        } as Protocol.AuthDoesUserExistResponse);
    }
    
    public createUser = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.AuthCreateUserRequest = req.body ?? {};

        if (!validateDisplayName(body.displayName)) {
            res.status(400).json({ message: "displayName failed validation" } as Protocol.ErrorResponse);
            return;
        }
        if (!validateUserName(body.userName)) {
            res.status(400).json({ message: "userName failed validation" } as Protocol.ErrorResponse);
            return;
        }
        if (!validateEmail(body.email)) {
            res.status(400).json({ message: "email failed validation" } as Protocol.ErrorResponse);
            return;
        }
        if (!validatePassword(body.password)) {
            res.status(400).json({ message: "password failed validation" } as Protocol.ErrorResponse);
            return;
        }

        const hashedUserPassword = await HashedUserPassword.createNew(body.password);
        const userId = uuidv7();

        const timestamp = new Date();

        try {
            await this.userDao.createUser(
                userId,
                body.userName,
                body.email,
                body.displayName,
                hashedUserPassword.digest,
                timestamp,
            )
        } catch(e) {
            if (e instanceof UserNotUniqueError) {
                res.status(403).json({ code: 1, message: "userName or email is already taken" } as Protocol.ErrorResponse);
                return;
            }

            console.log(`Error occurred in user dao: ${e}`);
            res.status(500).end();
            return;
        }

        const encodedRefreshToken = this.sessionAuthority.signAndEncodeToken({
            userId: userId,
            timestamp: timestamp.toISOString(),
        } as Protocol.RefreshToken);
        const encodedSessionToken = this.sessionAuthority.signAndEncodeToken({
            userId: userId,
            timestamp: timestamp.toISOString(),
            claims: [],
        } as Protocol.SessionToken);
        res.status(200).json({
            refreshToken: encodedRefreshToken,
            sessionToken: encodedSessionToken,
            user: {
                userId: userId,
                chompScore: defaultChompScore,
            },
        } as Protocol.AuthCreateUserResponse);
    }

    public signIn = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.AuthSignInRequest = req.body;

        if (body.userName != undefined && body.email != undefined) {
            res.status(400).json({ message: "Only one of userName or email must be specified" });
            return;
        }

        if (!validatePassword(body.password)) {
            res.status(400).json({ message: "password failed validation" } as Protocol.ErrorResponse);
            return;
        }

        let dbUser: UserDocument | null | undefined = undefined;
        if (body.userName != undefined) {
            if (!validateUserName(body.userName)) {
                res.status(400).json({ message: "userName failed validation" } as Protocol.ErrorResponse);
                return;
            }
            dbUser = await this.userDao.getUserByUserName(body.userName);
        }
        if (body.email != undefined) {
            if (!validateEmail(body.email)) {
                res.status(400).json({ message: "email failed validation" } as Protocol.ErrorResponse);
                return;
            }
            dbUser = await this.userDao.getUserByEmail(body.email);
        }
        if (dbUser === undefined) {
            res.status(400).json({ message: "One of userName or email must be specified" } as Protocol.ErrorResponse);
            return
        }
        if (dbUser == null) {
            res.status(404).end();
            return;
        }

        if (!await new HashedUserPassword(dbUser.passwordDigest).doesPasswordMatch(body.password)) {
            res.status(401).json({ code: 2, message: "userName or email and password does not match" } as Protocol.ErrorResponse);
            return;
        }

        const timestamp = new Date();
        const encodedRefreshToken = this.sessionAuthority.signAndEncodeToken({
            userId: dbUser._id,
            timestamp: timestamp.toISOString(),
        } as Protocol.RefreshToken);
        const encodedSessionToken = this.sessionAuthority.signAndEncodeToken({
            userId: dbUser._id,
            timestamp: timestamp.toISOString(),
            claims: [],
        } as Protocol.SessionToken);
        res.status(200).json({
            refreshToken: encodedRefreshToken,
            sessionToken: encodedSessionToken,
            user: {
                userId: dbUser._id,
                email: dbUser.email,
                userName: dbUser.userName,
                displayName: dbUser.displayName,
                chompScore: dbUser.chompScore,
            }
        } as Protocol.AuthSignInResponse);
    }

    public refresh = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.AuthRefreshRequest = req.body;

        const refreshToken = this.sessionAuthority.verifyAndDecodeRefreshToken(body.refreshToken);
        if (refreshToken == null) {
            res.status(401).json({ message: "Refresh token is invalid or expired" });
            return;
        }
        
        let dbUser: UserDocument | null;
        try {
            dbUser = await this.userDao.getUserById(refreshToken.userId);
        } catch(e) {
            console.log(`Error occurred in user dao: ${e}`);
            res.status(500).end();
            return;
        }
        if (dbUser == null) {
            res.status(401).json({ message: "Refresh token is invalid or expired" });
            return;
        }

        if (new Date(refreshToken.timestamp).getTime() < dbUser.allowRefreshTokensCreatedAfter.getTime()) {
            res.status(401).json({ message: "Refresh token is invalid or expired" });
            return;
        }

        const timestamp = new Date();
        const encodedSessionToken = this.sessionAuthority.signAndEncodeToken({
            userId: dbUser._id,
            timestamp: timestamp.toISOString(),
            claims: [],
        } as Protocol.SessionToken);
        res.status(200).json({
            sessionToken: encodedSessionToken,
        } as Protocol.AuthRefreshResponse);
    }

    public invalidateTokens = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.AuthSignInRequest = req.body;

        if (body.userName != undefined && body.email != undefined) {
            res.status(400).json({ message: "Only one of userName or email must be specified" });
            return;
        }

        if (!validatePassword(body.password)) {
            res.status(400).json({ message: "password failed validation" } as Protocol.ErrorResponse);
            return;
        }
        
        let dbUser: UserDocument | null | undefined = undefined;
        if (body.userName != undefined) {
            if (!validateUserName(body.userName)) {
                res.status(400).json({ message: "userName failed validation" } as Protocol.ErrorResponse);
                return;
            }
            dbUser = await this.userDao.getUserByUserName(body.userName);
        }
        if (body.email != undefined) {
            if (!validateEmail(body.email)) {
                res.status(400).json({ message: "email failed validation" } as Protocol.ErrorResponse);
                return;
            }
            dbUser = await this.userDao.getUserByEmail(body.email);
        }
        if (dbUser === undefined) {
            res.status(400).json({ message: "One of userName or email must be specified" } as Protocol.ErrorResponse);
            return
        }
        if (dbUser == null) {
            res.status(404).end();
            return;
        }

        if (!await new HashedUserPassword(dbUser.passwordDigest).doesPasswordMatch(body.password)) {
            res.status(401).json({ code: 2, message: "userName or email and password does not match" } as Protocol.ErrorResponse);
            return;
        }

        this.userDao.invalidateUserTokens(dbUser);
    }
}
