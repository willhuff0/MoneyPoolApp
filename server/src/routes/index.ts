import { Router } from "express";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import groupRoutes from "./groups.js";
import transactionRoutes from "./transactions.js";

const api = Router();

api.use("/auth", authRoutes);
api.use("/users", userRoutes);
api.use("/groups", groupRoutes);
api.use("/", transactionRoutes); 

export default api;
