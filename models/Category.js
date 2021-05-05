const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, require: true },
  emoji: { type: String, default: "💰" },
});

module.exports = model("Category", schema);
