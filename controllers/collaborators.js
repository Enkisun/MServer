const Space = require("../models/Space");
const User = require("../models/User");

module.exports = {
  addCollaborator: async (req, res) => {
    const { email, spaceId } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }

    if (spaceId !== `${user.space}`) {
      await Space.deleteOne({ _id: user.space }, (error) => {
        if (error) {
          return res.status(400).json({ message: error.message });
        }
      });
    }

    await User.updateOne({ email }, { space: spaceId }, (error) => {
      if (error) {
        return res.status(400).json({ message: error.message });
      }
    });

    await Space.updateOne(
      { _id: spaceId },
      {
        $addToSet: { collaborators: user._id },
        $pull: { invitations: user._id },
      },
      { safe: true, multi: true },
      (error, result) => {
        if (error) {
          return res.status(400).json({ message: error.message });
        }

        res.json({
          result,
          message: `User added to collaborators successfully`,
        });
      }
    );
  },
};
