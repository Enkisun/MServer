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
    const { category, emoji } = req.body;

    Category.create({ name: category, emoji }, (error, categories) => {
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.json({ categories });
    });
  },
};
