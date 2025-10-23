import { Request, Response, NextFunction } from "express";



export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    console.log("Auth middleware passed");
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(403).json({ message: "Invalid token" });
  }
};
