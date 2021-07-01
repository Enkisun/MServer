const ExpenseSpace = require("../models/ExpenseSpace");
const User = require("../models/User");

module.exports = {
  addCollaborator: async (req, res) => {
    const { email, expenseSpaceId } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }

    if (expenseSpaceId !== `${user.expenseSpace}`) {
      await ExpenseSpace.deleteOne({ _id: user.expenseSpace }, (error) => {
        if (error) {
          return res.status(400).json({ message: error.message });
        }
      });
    }

    await User.updateOne(
      { email },
      { expenseSpace: expenseSpaceId },
      (error) => {
        if (error) {
          return res.status(400).json({ message: error.message });
        }
      }
    );

    await ExpenseSpace.updateOne(
      { _id: expenseSpaceId },
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
