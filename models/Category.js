const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  id: { type: Schema.Types.ObjectId, required: true, unique: true },
  name: { type: String },
  emoji: { type: String },
});

module.exports = model("Category", categorySchema);
