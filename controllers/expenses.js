const ExpenseSpace = require("../models/ExpenseSpace");
const Expense = require("../models/Expense");
const Category = require("../models/Category");

module.exports = {
  getExpenses: (req, res) => {
    const { from, to, expenseSpaceId } = req.query;

    let query = {};

    if (from) {
      query.$gte = new Date(parseInt(from));
      query.$lte = to ? new Date(parseInt(to)) : new Date();
    } else {
      query = { $gte: new Date().getMonth(), $lte: new Date() };
    }

    ExpenseSpace.find({ _id: expenseSpaceId })
      .populate({
        path: "expenses",
        match: {
          createdAt: query,
        },
      })
      .exec((error, result) => {
        if (error) {
          return res.status(400).json({ message: e.message });
        }

        res.json(result[0].expenses);
      });
  },
  addExpense: async (req, res) => {
    const { author, amount, category, expenseSpaceId } = req.body;

    const newCategory = await Category.findOneAndUpdate(
      { name: category },
      {},
      { setDefaultsOnInsert: true, new: true, upsert: true },
      (error) => {
        if (error) {
          res.status(400).json({ message: error.message });
        }
      }
    );

    const newExpense = new Expense({
      author,
      amount,
      categoryId: newCategory._id,
    });

    ExpenseSpace.updateOne(
      { _id: expenseSpaceId },
      { $addToSet: { expenses: newExpense._id, categories: newCategory._id } },
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
  changeExpense: (req, res) => {
    const { id, author, amount, categoryId } = req.body;

    const update = { author, amount, categoryId };

    for (let prop in update) {
      if (!update[prop]) {
        delete update[prop];
      }
    }

    Expense.findOneAndUpdate({ _id: id }, { $set: update }, (error, result) => {
      if (error) {
        return res.status(400).json({ message: `${error.message}` });
      }

      res.json({ result, message: `Editing completed successfully` });
    });
  },
};
