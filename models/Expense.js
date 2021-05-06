const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    description: String,
    author: { type: String, required: true },
    amount: { type: Number, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Expense", schema);
