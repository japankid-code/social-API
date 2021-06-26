const router = require("express").Router();
const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThought,
  removeThought,
  addReaction,
  removeReaction,
} = require("../../controllers/thought-controller");

// get all of the thought /api/thoughts
router.route("/").get(getAllThought);

// get and del thought by /api/thoughts/_id
router
  .route("/:thoughtId")
  .get(getThoughtById)
  .delete(removeThought)
  .put(updateThought);

// /api/thought/<userId> create thought for user
router.route("/:userId").post(createThought);

// // /api/thought/<thoughtId>/reactions
router.route("/:thoughtId/reaction").post(addReaction);

router.route("/:thoughtId/:reactionId").delete(removeReaction);

module.exports = router;
