const Space = require("../models/Space");
const User = require("../models/User");

module.exports = {
  addInvitation: async (req, res) => {
    const { email, spaceId } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }

    Space.updateOne(
      { _id: spaceId },
      { $addToSet: { invitations: user._id } },
      (error, result) => {
        if (error) {
          return res.status(400).json({ message: error.message });
        }

        res.json({
          result,
          message: `User was successfully added to the invitees`,
        });
      }
    );
  },
  deleteInvitation: async (req, res) => {
    const { email, spaceId } = req.query;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }

    Space.updateOne(
      { _id: spaceId },
      { $pull: { invitations: user._id } },
      { safe: true, multi: true },
      (error) => {
        if (error) {
          return res.status(400).json({ message: error.message });
        }

        res.json({ message: "Deletion completed successfully" });
      }
    );
  },
};
