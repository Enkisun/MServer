const { Schema, model } = require("mongoose");

const schema = new Schema({
  description: String,
  author: { type: String, required: true },
  amount: { type: Number, required: true },
  categoryId: { required: true }, // ref?
});

module.exports = model("Expense", schema);
