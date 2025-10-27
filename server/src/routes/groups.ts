import { Router } from "express";
import { auth } from "../middleware/auth";
const router = Router();

/**
 * getGroup(token, group_id) -> Group
 * GET /groups/:group_id
 */
router.get("/:group_id", auth, async (req, res) => {
  // TODO: controller.getGroup(req.user, req.params.group_id)
  res.status(501).json({ message: "getGroup not implemented yet" });
});

/**
 * createGroup(token, user_id, name) -> group_id
 * POST /groups
 * body: { user_id, name }
 */
router.post("/", auth, async (req, res) => {
  // TODO: controller.createGroup(req.user, req.body.user_id, req.body.name)
  res.status(501).json({ message: "createGroup not implemented yet" });
});

/**
 * addUserToGroup(token, group_id, user_id)
 * POST /groups/:group_id/members
 * body: { user_id }
 */
router.post("/:group_id/members", auth, async (req, res) => {
  // TODO: controller.addUserToGroup(req.user, req.params.group_id, req.body.user_id)
  res.status(501).json({ message: "addUserToGroup not implemented yet" });
});

/**
 * removeUserFromGroup(token, group_id, user_id)
 * DELETE /groups/:group_id/members/:user_id
 */
router.delete("/:group_id/members/:user_id", auth, async (req, res) => {
  // TODO: controller.removeUserFromGroup(req.user, req.params.group_id, req.params.user_id)
  res.status(501).json({ message: "removeUserFromGroup not implemented yet" });
});

export default router;
