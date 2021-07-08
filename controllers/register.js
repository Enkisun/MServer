const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cfg = require("../config");
const User = require("../models/User");
const Space = require("../models/Space");
const Category = require("../models/Category");

module.exports = {
  register: [
    check("email", "Incorrect email").isEmail(),
    check("password", "Password length at least 6 characters").isLength({
      min: 6,
    }),
    async (req, res) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
            message: "Incorrect registration data",
          });
        }

        const { email, password } = req.body;

        const candidate = await User.findOne({ email });

        if (candidate) {
          return res.status(400).json({ message: "This user already exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({ email, password: hashedPassword });

        const space = new Space({
          name: `${user.name}Space`,
          collaborators: user._id,
        });

        await Category.create([
          { name: "Food" },
          { name: "Transport" },
          { name: "Sport" },
        ]).then((categories) => {
          space.categories = categories.map((item) => item._id);
        });

        user.space = (await space.save())._id;

        await user.save();

        const token = jwt.sign({ userId: user._id }, cfg.jwtSecret, {
          expiresIn: "365d",
        });

        res.status(201).json({
          user: {
            name: user.name,
            id: user._id,
            spaceId: user.space,
          },
          token,
        });
      } catch (e) {
        res
          .status(500)
          .json({ message: "Something went wrong, please try again" });
      }
    },
  ],
};
