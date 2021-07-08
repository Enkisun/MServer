const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    name: String,
    collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    invitations: [{ type: Schema.Types.ObjectId, ref: "User" }],
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
  },
  { versionKey: false }
);

module.exports = model("Space", schema);
