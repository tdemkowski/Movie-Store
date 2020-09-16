const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("5f60aecbe78ae131f46df543") // old:  5f0dba9f155120daca86cfc7
    .then(user => {
      // if (!user.cart) {
      //   console.log("No cart.");
      //   user.cart = { items: [] };
      // }
      req.user = user
      next()
    })
    .catch(err => console.log(err))
});

app.use("/admin", adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoose
  .connect(
    "mongodb+srv://Thomas:lEsFkdKR4QdYoRuM@cluster0.vzubn.mongodb.net/shop?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: []
          }
        })
        user.save()
      }
    })
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
