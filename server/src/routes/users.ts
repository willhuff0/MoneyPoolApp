// import { Router } from "express";
// import { auth } from "../middleware/auth";


// const router = Router();


// /**
//  * getUser(token, user_id) -> User
//  * GET /users/:user_id
//  * headers: Authorization: Bearer <token>
//  */
// router.get("/:user_id", auth, async (req, res) => {
//   // TODO: controller.getUser(req.user, req.params.user_id)
//   res.status(501).json({ message: "getUser not implemented yet" });
// });

// /**
//  * searchUser(token, query, start, limit) -> User[]
//  * GET /users?query=&start=&limit=
//  * headers: Authorization: Bearer <token>
//  */
// router.get("/", auth, async (req, res) => {
//   // const { query = "", start = 0, limit = 20 } = req.query;
//   // TODO: controller.searchUser(req.user, { query, start, limit })

// });

// /**
//  * createFriendRequest(token, other_user_id)
//  * POST /users/:other_user_id/friends
//  */
// router.post("/:other_user_id/friends", auth, async (req, res) => {
//   // TODO: controller.createFriendRequest(req.user, req.params.other_user_id)

// });

// /**
//  * acceptFriendRequest(token, other_user_id)
//  * POST /users/:other_user_id/friends/accept
//  */
// router.post("/:other_user_id/friends/accept", auth, async (req, res) => {
//   // TODO: controller.acceptFriendRequest(req.user, req.params.other_user_id)
// });

// /**
//  * deleteFriendRequest(token, other_user_id)
//  * DELETE /users/:other_user_id/friends
//  */
// router.delete("/:other_user_id/friends", auth, async (req, res) => {
//   // TODO: controller.deleteFriendRequest(req.user, req.params.other_user_id)
// });

// export default router;