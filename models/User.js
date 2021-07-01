const { Schema, model } = require("mongoose");

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: {
    type: String,
    default: function () {
      return this.email.slice(0, this.email.indexOf("@"));
    },
  },
  expenseSpace: { type: Schema.Types.ObjectId, ref: "ExpenseSpace" },
});

module.exports = model("User", schema);
