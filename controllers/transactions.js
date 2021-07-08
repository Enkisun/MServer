const Space = require("../models/Space");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const User = require("../models/User");

module.exports = {
  getExpenses: async (req, res) => {
    const { from, to, spaceId, id } = req.query;

    const user = await User.findOne({ _id: id });

    if (spaceId !== `${user.space}`) {
      return res.status(400).json({
        message:
          "User does not have enough rights in this space of transactions",
      });
    }

    let query = {};

    if (from) {
      query.$gte = new Date(parseInt(from));
      query.$lte = to ? new Date(parseInt(to)) : new Date();
    } else {
      query = { $gte: new Date().getMonth(), $lte: new Date() };
    }

    Space.find({ _id: spaceId })
      .populate({
        path: "transactions",
        match: {
          date: query,
        },
      })
      .exec((error, result) => {
        if (error) {
          return res.status(400).json({ message: e.message });
        }

        res.json(result[0].transactions);
      });
  },
  addExpense: async (req, res) => {
    const { amount, category, date, note, spaceId, id } = req.body;

    const user = await User.findOne({ _id: id });

    if (spaceId !== `${user.space}`) {
      return res.status(400).json({
        message:
          "User does not have enough rights in this space of transactions",
      });
    }

    const newCategory = await Category.findOneAndUpdate(
      { name: category },
      {},
      { setDefaultsOnInsert: true, new: true, upsert: true },
      (error) => {
        if (error) {
          return res.status(400).json({ message: error.message });
        }
      }
    );

    const newExpense = new Transaction({
      authorId: user._id,
      amount,
      date,
      note,
      categoryId: newCategory._id,
    });

    Space.updateOne(
      { _id: spaceId },
      {
        $addToSet: {
          transactions: newExpense._id,
          categories: newCategory._id,
        },
      },
      (error) => {
        if (error) {
          return res.status(400).json({ message: error.message });
        }
      }
    );

    newExpense.save((error, result) => {
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.json({ result, message: `New expense added successfully` });
    });
  },
  changeExpense: async (req, res) => {
    const { id, amount, categoryId, transactionId, spaceId } = req.body;

    const user = await User.findOne({ _id: id });

    if (spaceId !== `${user.space}`) {
      return res.status(400).json({
        message:
          "User does not have enough rights in this space of transactions",
      });
    }

    const update = { authorId: user._id, amount, categoryId };

    for (let prop in update) {
      if (!update[prop]) {
        delete update[prop];
      }
    }

    Transaction.findOneAndUpdate(
      { _id: transactionId },
      { $set: update },
      (error, result) => {
        if (error) {
          return res.status(400).json({ message: `${error.message}` });
        }

        res.json({ result, message: `Editing completed successfully` });
      }
    );
  },
};
