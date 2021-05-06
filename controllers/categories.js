const Category = require("../models/Category");
const ExpenseSpace = require("../models/ExpenseSpace");

module.exports = {
  getCategories: (req, res) => {
    Category.find({}).exec((error, categories) => {
      if (error) {
        res.status(400).json({ message: e.message });
      }

      res.json({ categories });
    });
  },
  addCategory: async (req, res) => {
    const { category, emoji, expenseSpaceId } = req.body;

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
  changeCategory: (req, res) => {
    const { category, emoji, id } = req.body;

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
