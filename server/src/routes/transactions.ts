import { Router } from "express";
import { auth } from "../middleware/auth";
const router = Router();

/**
 * getTransactions(token, group_id, start, limit) -> Transaction[]
 * GET /groups/:group_id/transactions?start=&limit=
 */
router.get("/groups/:group_id/transactions", auth, async (req, res) => {
  // const { start = 0, limit = 20 } = req.query;
  // TODO: controller.getTransactions(req.user, req.params.group_id, { start, limit })
  res.status(501).json({ message: "getTransactions not implemented yet" });
});

/**
 * createTransaction(token, group_id, user_id, amount, description) -> transaction_id
 * POST /groups/:group_id/transactions
 * body: { user_id, amount, description }
 */
router.post("/groups/:group_id/transactions", auth, async (req, res) => {
  // TODO: controller.createTransaction(req.user, req.params.group_id, req.body)
  res.status(501).json({ message: "createTransaction not implemented yet" });
});

/**
 * deleteTransaction(token, transaction_id)
 * DELETE /transactions/:transaction_id
 */
router.delete("/transactions/:transaction_id", auth, async (req, res) => {
  // TODO: controller.deleteTransaction(req.user, req.params.transaction_id)
  res.status(501).json({ message: "deleteTransaction not implemented yet" });
});

export default router;
