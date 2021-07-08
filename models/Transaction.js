const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    description: String,
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    note: String,
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = model("Transaction", schema);
