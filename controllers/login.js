const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const cfg = require("../config");
const User = require("../models/User");

module.exports = {
  login: [
    check("email", "Введите корректный email").normalizeEmail().isEmail(),
    async (req, res) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
            message: "Некорректные данные при входе в систему",
          });
        }

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
          return res.status(400).json({ message: "Пользователь не найден" });
        }

        const token = jwt.sign({ userId: user._id }, cfg.jwtSecret, {
          expiresIn: "365d",
        });

        res.json({ token, user });
      } catch (e) {
        res
          .status(500)
          .json({ message: "Что-то пошло не так, попробуйте снова" });
      }
    },
  ],
};
