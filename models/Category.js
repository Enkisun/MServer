const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    emoji: String,
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("Category", schema);
