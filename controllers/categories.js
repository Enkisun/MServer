const Category = require("../models/Category");
const Space = require("../models/Space");
const User = require("../models/User");

module.exports = {
  getCategories: async (req, res) => {
    const { spaceId, id } = req.query;

    const user = await User.findOne({ _id: id });

    if (spaceId !== `${user.space}`) {
      return res.status(400).json({
        message:
          "User does not have enough rights in this space of transactions",
      });
    }

    Space.find({ _id: spaceId })
      .populate("categories")
      .exec((error, result) => {
        if (error) {
          return res.status(400).json({ message: e.message });
        }

        res.json(result[0].categories);
      });
  },
  addCategory: async (req, res) => {
    const { category, emoji, spaceId, id } = req.body;

    const user = await User.findOne({ _id: id });

    if (spaceId !== `${user.space}`) {
      return res.status(400).json({
        message:
          "User does not have enough rights in this space of transactions",
      });
    }

    const newCategory = new Category({
      name: category,
      emoji,
    });

    Space.updateOne(
      { _id: spaceId },
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
    const { categoryId, category, emoji, id, spaceId } = req.body;

    const user = await User.findOne({ _id: id });

    if (spaceId !== `${user.space}`) {
      return res.status(400).json({
        message:
          "User does not have enough rights in this space of transactions",
      });
    }

    const update = { name: category, emoji };

    for (let prop in update) {
      if (!update[prop]) {
        delete update[prop];
      }
    }

    Category.findOneAndUpdate(
      { _id: categoryId },
      { $set: update },
      (error) => {
        if (error) {
          return res.status(400).json({ message: `${error.message}` });
        } else {
          res.json({ message: `Editing completed successfully` });
        }
      }
    );
  },
};
