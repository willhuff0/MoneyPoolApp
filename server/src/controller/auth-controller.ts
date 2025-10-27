import { Request, Response } from 'express';
import { v7 as uuidv7 } from 'uuid';

import { validateDisplayName, validateEmail, validatePassword, validateUserName } from '@shared/validation';
import * as Protocol from '@shared/protocol';

import { UserDao, UserNameTakenError } from 'src/dao/user-dao';
import { HashedUserPassword } from 'src/security/hashed-user-password';
import { SessionAuthority } from 'src/security/session-authority';
import { DbUser } from 'src/models'

export class AuthController {
    userDao: UserDao;
    sessionAuthority: SessionAuthority;

    constructor(userDao: UserDao, sessionAuthority: SessionAuthority) {
        this.userDao = userDao;
        this.sessionAuthority = sessionAuthority;
    }
    
    public createUser = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.AuthCreateUserRequest = req.body;

        if (!validateDisplayName(body.displayName)) {
            res.status(400).end();
            return;
        }
        if (!validateUserName(body.userName)) {
            res.status(400).end();
            return;
        }
        if (!validateEmail(body.email)) {
            res.status(400).end();
            return;
        }
        if (!validatePassword(body.password)) {
            res.status(400).end();
            return;
        }

        const hashedUserPassword = await HashedUserPassword.createNew(body.password);
        const userId = uuidv7();

        try {
            await this.userDao.createUser(
                userId,
                body.displayName,
                body.userName,
                body.email,
                hashedUserPassword.digest,
            )
        } catch(e) {
            if (e instanceof UserNameTakenError) {
                res.status(403).json({ message: "userName must be unique" } as Protocol.ErrorResponse);
                return;
            }

            console.log(`Error occurred in auth dao: ${e}`);
            res.status(500).end();
            return;
        }

        const ip = req.ip;
        if (ip == undefined) {
            // ip is only null if the client already disconnected
            res.end();
            return;
        }

        const encodedSessionToken = this.sessionAuthority.signAndEncodeToken({
            userId: userId,
            timestamp: new Date().toISOString(),
            ip: ip,
            claims: [],
        });
        res.status(200).json({ token: encodedSessionToken } as Protocol.AuthCreateUserResponse);
    }

    public startSession = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.AuthStartSessionRequest = req.body;

        if (body.userName != undefined && body.email != undefined) {
            res.status(400).json({ message: "Only one of userName or email must be specified" });
            return;
        }

        if (!validatePassword(body.password)) {
            res.status(400).end();
            return;
        }

        let dbUser: DbUser | null | undefined = undefined;
        if (body.userName != undefined) {
            if (!validateUserName(body.userName)) {
                res.status(400).end();
                return;
            }
            dbUser = await this.userDao.getUserByUserName(body.userName);
        }
        if (body.email != undefined) {
            if (!validateEmail(body.email)) {
                res.status(400).end();
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

        if (!new HashedUserPassword(dbUser.passwordDigest).doesPasswordMatch(body.password)) {
            res.status(401).end();
            return;
        }

        const ip = req.ip;
        if (ip == undefined) {
            // ip is only null if the client already disconnected
            res.end();
            return;
        }

        const encodedSessionToken = this.sessionAuthority.signAndEncodeToken({
            userId: dbUser.userId,
            timestamp: new Date().toISOString(),
            ip: ip,
            claims: [],
        });
        res.status(200).json({
            token: encodedSessionToken,
            email: dbUser.email,
            userName: dbUser.userName,
            displayName: dbUser.displayName,
            chompScore: dbUser.chompScore,
        } as Protocol.AuthStartSessionResponse);
    }
}