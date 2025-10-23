import type { Request, Response, NextFunction } from "express";
import { SessionToken, User } from "../models"; // <-- adjust path if needed

// Extract "Bearer <token>"
function getBearerToken(req: Request): string | null {
  const raw = req.headers.authorization || "";
  if (!raw.startsWith("Bearer ")) return null;
  return raw.slice(7);
}

/**
 * Auth middleware:
 * - Requires a valid opaque token stored in SessionToken.signature
 * - Loads the corresponding User (by session.user_id)
 * - Attaches req.user and req.session for downstream handlers
 */
export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ ok: false, message: "No token provided" });
    }

    const session = await SessionToken.findOne({ signature: token });
    if (!session) {
      return res.status(401).json({ ok: false, message: "Invalid or expired session" });
    }

    const user = await User.findOne({ user_id: session.user_id });
    if (!user) {
      // defensive cleanup for orphaned sessions
      await SessionToken.deleteOne({ _id: session._id });
      return res.status(401).json({ ok: false, message: "Invalid or expired session" });
    }

    // Attach to req for controllers (use type-augment later if you want)
    // @ts-ignore
    req.user = user;
    // @ts-ignore
    req.session = session;

    return next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ ok: false, message: "Auth check failed" });
  }
}

