const Category = require("../models/Category");
const ExpenseSpace = require("../models/ExpenseSpace");

module.exports = {
  getCategories: async (req, res) => {
    const { expenseSpaceId, email } = req.query;

    const user = await User.findOne({ email });

    if (expenseSpaceId !== `${user.expenseSpace}`) {
      return res.status(400).json({
        message: "User does not have enough rights in this space of expenses",
      });
    }

    ExpenseSpace.find({ _id: expenseSpaceId })
      .populate("categories")
      .exec((error, result) => {
        if (error) {
          return res.status(400).json({ message: e.message });
        }

        res.json(result[0].categories);
      });
  },
  addCategory: async (req, res) => {
    const { category, emoji, expenseSpaceId, email } = req.body;

    const user = await User.findOne({ email });

    if (expenseSpaceId !== `${user.expenseSpace}`) {
      return res.status(400).json({
        message: "User does not have enough rights in this space of expenses",
      });
    }

    const newCategory = new Category({
      name: category,
      emoji,
    });

    ExpenseSpace.updateOne(
      { _id: expenseSpaceId },
      { $addToSet: { categories: newCategory._id } },
      (error) => {
        if (error) {
          return res.status(400).json({ message: error.message });
        }
      }
    );

    newCategory.save((error, result) => {
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.json({ result, message: `New category added successfully` });
    });
  },
  changeCategory: async (req, res) => {
    const { category, emoji, id, email, expenseSpaceId } = req.body;

    const user = await User.findOne({ email });

    if (expenseSpaceId !== `${user.expenseSpace}`) {
      return res.status(400).json({
        message: "User does not have enough rights in this space of expenses",
      });
    }

    const update = { name: category, emoji };

    for (let prop in update) {
      if (!update[prop]) {
        delete update[prop];
      }
    }

    Category.findOneAndUpdate({ _id: id }, { $set: update }, (error) => {
      if (error) {
        return res.status(400).json({ message: `${error.message}` });
      } else {
        res.json({ message: `Editing completed successfully` });
      }
    });
  },
};
