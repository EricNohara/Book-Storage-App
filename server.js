if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const port = 3000;
const app = express();
const indexRouter = require("./routes/index");
const hbs = require("express-handlebars").create({
  layoutsDir: __dirname + "/views/layouts",
  extname: "hbs",
  defaultLayout: "main",
});

app.set("port", process.env.PORT || port);
app.set("view engine", "hbs");
app.engine("hbs", hbs.engine);
app.use(express.static("public"));

// Setting up Database with Mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

db.on("error", (error) => {
  console.error(error);
});

db.once("open", () => {
  console.log("Connected to Mongoose!");
});

app.use("/", indexRouter);

app.listen(app.get("port"), function () {
  console.log("Server started at http://localhost:" + app.get("port"));
});
