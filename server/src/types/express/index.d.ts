import { SessionToken } from "@shared/json";

declare global {
    namespace Express {
        interface Request {
            sessionToken?: SessionToken;
        }
    }
}