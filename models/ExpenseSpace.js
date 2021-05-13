const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: String,
  collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
  dormants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  expenses: [{ type: Schema.Types.ObjectId, ref: "Expense" }],
});

module.exports = model("ExpenseSpace", schema);
