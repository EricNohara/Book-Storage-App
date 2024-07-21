if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const methodOverride = require("method-override");
const port = 3000;
const app = express();

// Setting up Handlebars
const hbs = require("express-handlebars").create({
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
  extname: "hbs",
  defaultLayout: "main",
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  },
  helpers: {
    isAuthor: (author, book) => {
      return author.id === book.author;
    },
    formatPublishDate: (book) => {
      return book.publishDate == null
        ? ""
        : book.publishDate.toISOString().split("T")[0];
    },
    concat: (...args) => {
      args.pop();
      return args.join("");
    },
    checkBooksByAuthor: (booksByAuthor) => {
      if (booksByAuthor.length > 0) return true;
      else return false;
    },
    convertToDateString: (date) => {
      return date.toDateString();
    },
  },
});

app.set("port", process.env.PORT || port);
app.set("view engine", "hbs");
app.engine("hbs", hbs.engine);
app.use(express.static("public"));
app.use(methodOverride("_method"));

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

// Body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

// Routes
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");

app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);

app.listen(app.get("port"), function () {
  console.log("Server started at http://localhost:" + app.get("port"));
});
