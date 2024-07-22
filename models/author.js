const mongoose = require("mongoose");
const Book = require("./book");
const authorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

authorSchema.pre("deleteOne", async function (next) {
  let books;
  try {
    books = await Book.find({ author: this.getFilter()._id });
    if (books.length > 0) {
      next(new Error("This author still has books in the database!"));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Author", authorSchema);
