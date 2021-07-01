const ExpenseSpace = require("../models/ExpenseSpace");
const User = require("../models/User");

module.exports = {
  addInvitation: async (req, res) => {
    const { email, expenseSpaceId } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }

    ExpenseSpace.updateOne(
      { _id: expenseSpaceId },
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
    const { email, expenseSpaceId } = req.query;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }

    ExpenseSpace.updateOne(
      { _id: expenseSpaceId },
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
