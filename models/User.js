const { Schema, model } = require("mongoose");

const schema = new Schema({
  id: { type: Schema.Types.ObjectId, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: {
    type: String,
    default: () => {
      this.email.slice(0, this.email.indexOf("@"));
    },
  },
});

module.exports = model("User", schema);
