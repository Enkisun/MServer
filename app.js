const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cfg = require("./config");
const loginController = require("./controllers/login");
const registerController = require("./controllers/register");
const categoriesController = require("./controllers/categories");
const expenseController = require("./controllers/expenses");

const app = express();

mongoose.set("useFindAndModify", false);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.route("/register").post(registerController.register);

app.route("/login").post(loginController.login);

app
  .route("/expenses")
  .get(expenseController.getExpenses)
  .post(expenseController.addExpense)
  .put(expenseController.changeExpense);

app
  .route("/categories")
  .get(categoriesController.getCategories)
  .post(categoriesController.addCategory)
  .put(categoriesController.changeCategory);

async function start() {
  try {
    await mongoose.connect(cfg.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(cfg.port, () =>
      console.log(`App has been started on port ${cfg.port}...`)
    );
  } catch (e) {
    console.log(`Server error: ${e.message}`);
    process.exit(1);
  }
}

start();
