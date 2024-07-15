const express = require("express");
const router = express.Router();

const demo = {
  name: "Eric",
  age: 20,
};

router.get("/", (req, res) => {
  res.render("index", { demo: demo });
});

module.exports = router;
