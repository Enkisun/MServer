const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cfg = require("../config");
const User = require("../models/User");

module.exports = {
  login: [
    check("email", "Please enter a valid email").normalizeEmail().isEmail(),
    async (req, res) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
            message: "Incorrect login data",
          });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
          return res.status(400).json({ message: "Incorrect login data" });
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (isMatchPassword) {
          const token = jwt.sign({ userId: user._id }, cfg.jwtSecret, {
            expiresIn: "365d",
          });

          res
            .status(200)
            .json({ user: { name: user.name, id: user._id }, token });
        } else {
          res.status(400).json({ message: "Invalid login or password" });
        }
      } catch (e) {
        res
          .status(500)
          .json({ message: "Something went wrong, please try again" });
      }
    },
  ],
};
