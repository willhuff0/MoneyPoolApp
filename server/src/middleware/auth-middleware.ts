import type { Request, Response, NextFunction } from "express";

import { TokenAuthority } from '../security/token-authority';

export class AuthMiddleware {
  sessionAuthority: TokenAuthority;

  constructor(sessionAuthority: TokenAuthority) {
    this.sessionAuthority = sessionAuthority;
  }

  getBearerToken = (req: Request): string | undefined => {
    const raw = req.headers.authorization || "";
    if (!raw.startsWith("Bearer ")) return undefined;
    return raw.slice(7);
  }

  ensureAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const encodedSessionToken = this.getBearerToken(req);
      if (encodedSessionToken == undefined) {
        res.status(401).json({ message: "Session token is required" });
        return;
      }
      const sessionToken = this.sessionAuthority.verifyAndDecodeSessionToken(encodedSessionToken);
      if (sessionToken == null) {
        res.status(401).json({ message: "Session token is invalid or expired" });
        return;
      }

      req.sessionToken = sessionToken;
      next();
    } catch (e: unknown) {
      console.log(`An error occurred during auth middleware: ${e}`);
      res.status(500).end();
    }
  }
}
