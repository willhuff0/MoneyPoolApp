import type { Request, Response, NextFunction } from "express";

import { ErrorResponse } from "@money-pool-app/shared";

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: 'Not Found.' } as ErrorResponse);
};

export const catchAllMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An error occurred.' } as ErrorResponse);
};
