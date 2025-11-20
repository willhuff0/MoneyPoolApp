import { Router } from "express";

import { poolAddMemberEndpoint, poolCreatePoolEndpoint, poolDeletePoolEndpoint, poolGetPoolEndpoint, poolRemoveMemberEndpoint } from "@money-pool-app/shared";

import { PoolDao } from "../daos/pool-dao";
import { PoolController } from "../controllers/pool-controller";

const removePrefix = (fullPath: string): string => {
    const secondSlashIndex = fullPath.indexOf('/', 1);
    return secondSlashIndex === -1 ? '/' : fullPath.substring(secondSlashIndex);
};

export const getPoolRouter = (poolDao: PoolDao): Router => {
    const router = Router();

    const controller = new PoolController(poolDao);

    router.all(removePrefix(poolGetPoolEndpoint), controller.getPool);
    router.all(removePrefix(poolCreatePoolEndpoint), controller.createPool);
    router.all(removePrefix(poolDeletePoolEndpoint), controller.deletePool);
    router.all(removePrefix(poolAddMemberEndpoint), controller.addMember);
    router.all(removePrefix(poolRemoveMemberEndpoint), controller.removeMember);

    return router;
}
