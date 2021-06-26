const { Thought, User, Reaction } = require("../models");

const thoughtController = {
  // get all thought
  getAllThought(req, res) {
    Thought.find({})
      .select("-__v")
      .sort({ _id: -1 }) // most recent first
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      // .populate({
      //   path: "reactions",
      //   select: "-__v",
      // })
      .select("-__v")
      .sort({ _id: -1 })

      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // createThought
  async createThought({ params, body }, res) {
    // body looks like this:
    // {
    //   "thoughtText": "This one sweet thought..."
    // }
    const creatorUsername = await User.findOne({ _id: params.userId }).then(
      (userData) => userData.username
    );
    if (!creatorUsername) {
      return res.status(400).json({ error: "user not found" });
    }
    const user = {
      userId: params.userId,
      thoughtText: body.thoughtText,
      username: creatorUsername,
    };

    let thought = await Thought.create(
      user //function (err, small) {
      // if (err) return console.log(err);
      // saved!
    )
      .then(async (dbThoughtData) => {
        // console.log("db thought create" + dbThoughtData);

        await User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: dbThoughtData._id } }
        ).then(async (dbUpdateUser) => {
          if (dbUpdateUser) {
            return await res.json(dbThoughtData);
          }
          return await res.json({ error: "user not found" });
        });
        // await res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // update thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  removeReaction({ params, body }, res) {
    console.log(params);
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { _id: params.reactionId.toString() } } },
      { new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = thoughtController;
