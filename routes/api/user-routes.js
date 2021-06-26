const router = require("express").Router();
const {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addUserFriend,
  deleteUserFriend,
} = require("../../controllers/user-controller");

// get, post @ /api/users
router.route("/").get(getAllUser).post(createUser);

// get, put, del @ /api/users/:id
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

router // add and delete friends :)
  .route("/:userId/friends/:friendId")
  .post(addUserFriend)
  .delete(deleteUserFriend);

module.exports = router;
