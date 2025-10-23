import { Request, Response } from "express"
import { User, SessionToken } from "../models"
import crypto from "crypto"

const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ ok: true, data });
const fail = (res: Response, message = "Something went wrong", status = 400) =>
  res.status(status).json({ ok: false, message });

export const login = async (req: Request, res: Response) => {
    try {
        const { userName, password } = req.body as {userName?: number, password?: String}
        if (userName == null) return fail(res, "username required", 422)
        if (password == null) return fail(res, "username required", 422)

        const user = await User.findOne({userName})
        if (!user) return fail(res, "Invalid Credentials", 401);

        //checking in the mongo database to see if the pair exists
        if (password !== user.password && userName != user.username) return fail(res, "Invalid credentials", 401);

        
        const signature = crypto.randomBytes(32).toString("hex");
        const ip = (req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || "").toString();
        const claims = { user_id: user.user_id, userName: user.username };

        const token = await SessionToken.create({ user_id: user.user_id, name: user.name, ip, claims, signature });
        
        return ok(res, {
        token: token.signature,
        user: {userId: user.user_id, displayName: user.name, userName: user.username, chompScore: user.chomp_score,},
    }, 201);
    } 
    catch (error) {
    console.error("Login error:", error);
    return fail(res, "Login failed", 500);
    }
}