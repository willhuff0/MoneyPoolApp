import { Request, Response } from "express";
import { v7 as uuidv7 } from 'uuid';

import { validatePoolName } from "@money-pool-app/shared";
import * as Protocol from '@money-pool-app/shared';

import { PoolDao } from "../daos/pool-dao";

export class PoolController {
    poolDao: PoolDao;

    constructor(poolDao: PoolDao) {
        this.poolDao = poolDao;
    }

    public readonly getPools = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.PoolGetPoolsRequest = req.body;
        const sessionToken = req.sessionToken!;

        if (body.poolIds.length === 0) {
            res.status(400).end();
            return;
        }

        let pools = await Promise.all(body.poolIds.map((poolId) => this.poolDao.getPoolById(poolId)));
        pools = pools.filter((pool) => pool?.members.has(sessionToken.userId) ?? false);

        res.status(200).json({
            pools: pools.map((pool) => {
                return {
                    poolId: pool!._id,
                    displayName: pool!.name,
                    ownerUserId: pool!.owner,
                    members: pool!.members,
                    balance: pool!.balance,
                };
            }),
        } as Protocol.PoolGetPoolsResponse);
    }

    public readonly createPool = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.PoolCreatePoolRequest = req.body;
        const sessionToken = req.sessionToken!;

        if (!validatePoolName(body.name)) {
            res.status(400).json({ message: "name failed validation" } as Protocol.ErrorResponse);
            return;
        }

        const poolId = uuidv7();

        await this.poolDao.createPool(poolId, body.name, sessionToken.userId);

        res.status(200).json({
            poolId: poolId,
        } as Protocol.PoolCreatePoolResponse);
    }

    public readonly deletePool = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.PoolDeletePoolRequest = req.body;
        const sessionToken = req.sessionToken!;

        if (!await this.poolDao.deletePool(sessionToken.userId, body.poolId)) {
            res.status(400).json({ message: "Pool not found or user is not the owner" } as Protocol.ErrorResponse);
            return;
        }

        res.status(200).end();
    }

    public readonly addMember = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.PoolAddMemberRequest = req.body;
        const sessionToken = req.sessionToken!;

        if (!await this.poolDao.addMember(sessionToken.userId, body.poolId, body.userId)) {
            res.status(400).json({ message: "Pool not found or user is not the owner" } as Protocol.ErrorResponse);
            return;
        }

        res.status(200).end();
    }

    public readonly removeMember = async (req: Request, res: Response): Promise<void> => {
        const body: Protocol.PoolRemoveMemberRequest = req.body;
        const sessionToken = req.sessionToken!;

        if (!await this.poolDao.removeMember(sessionToken.userId, body.poolId, body.userId)) {
            res.status(400).json({ message: "Pool not found or user is not the owner" } as Protocol.ErrorResponse);
            return;
        }

        res.status(200).end();
    }
}