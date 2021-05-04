const Category = require("../models/Category");

module.exports = {
  getCategories: (req, res) => {
    Category.find({}).exec((error, categories) => {
      if (error) {
        res.status(400).json({ message: e.message });
      } else {
        res.json({ categories });
      }
    });
  },
  addCategory: async (req, res) => {
    const { category, emoji } = req.query;

    Category.findOneAndUpdate(
      { name: category, emoji },
      { $addToSet: update },
      { upsert: true },
      (error, categories) => {
        if (error) {
          return res.status(400).json({ message: error.message });
        }

        res.json({ categories });
      }
    );
  },
};
