import { SessionToken } from "@money-pool-app/shared";

declare global {
    namespace Express {
        interface Request {
            sessionToken?: SessionToken;
        }
    }
}
