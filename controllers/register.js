const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const cfg = require("../config");
const User = require("../models/User");
const ExpenseSpace = require("../models/ExpenseSpace");

module.exports = {
  register: [
    check("email", "Некорректный email").isEmail(),
    async (req, res) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
            message: "Некорректные данные при регистрации",
          });
        }

        const { email } = req.body;

        const candidate = await User.findOne({ email });

        if (candidate) {
          return res
            .status(400)
            .json({ message: "Такой пользователь уже существует" });
        }

        const user = new User({ email });

        const expenseSpace = new ExpenseSpace({
          name: `${user.name}Space`,
          collaborators: user._id,
        });

        user.expenseSpace = (await expenseSpace.save())._id;

        await user.save();

        const token = jwt.sign({ userId: user._id }, cfg.jwtSecret, {
          expiresIn: "365d",
        });

        res
          .status(201)
          .json({ token, user, expenseSpace, message: "Пользователь создан" });
      } catch (e) {
        res
          .status(500)
          .json({ message: "Что-то пошло не так, попробуйте снова" });
      }
    },
  ],
};