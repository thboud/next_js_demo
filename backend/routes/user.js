var express = require("express");
var router = express.Router();
var User = require("../models/user.model");
var bcrypt = require("bcryptjs");

router.get("/:id", (req, res) => {
  User.getUserById(req.params.id, (err, user) => {
    if (err) {
      console.error(err);
      res
        .status(400)
        .json({ error: true, message: "Error while fetching user info" });
    } else {
      if (user) {
        res.json(user);
      } else {
        res.status(400).json({ error: true, message: "User does not exist" });
      }
    }
  });
});

router.post("/add/", (req, res) => {
  let newUser = User(req.body);
  /* Gets user by username to check for existing username. If none found, it continues */
  User.getUserByUsername(req.body.username, (err, userUsername) => {
    if (!userUsername) {
      /* Gets user by email to check for existing email. If none found, it continues */
      User.getUserByEmail(req.body.email, (err, userEmail) => {
        if (!userEmail) {
          User.createUser(newUser, err => {
            if (err) {
              console.error(err);
              res
                .status(400)
                .json({ error: true, message: "Error while creating user" });
            } else {
              res.status(200).json({ error: false });
            }
          });
        } else {
          res.status(400).json({ error: true, message: "Email is being used" });
        }
      });
    } else {
      res.status(400).json({ error: true, message: "Username is being used" });
    }
  });
});

router.post("/update/:id", (req, res) => {
  User.getUserById(req.params.id, (err, user) => {
    if (err) {
      console.error(err);
      res
        .status(400)
        .json({ error: true, message: "Error while fetching user info" });
    } else {
      /* Generates password hash beforehand because it can't be done inline with the user.save() due to async js --__-- */
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          /* If fields are different, it changes them accordingly then saves */
          if (req.body.username !== user.username)
            user.username = req.body.username;

          if (req.body.email !== user.email) user.email = req.body.email;

          if (req.body.name !== user.name) user.name = req.body.name;

          if (req.body.password !== user.password) {
            /* Hashes new password */
            user.password = hash;
          }
          /* After all the changes it saves them */
          user
            .save()
            .then(cb => {
              res.status(200).json({ error: false });
            })
            .catch(err => {
              if (err) throw err;
              res.status(400).json({
                error: true,
                message: "Error when saving user changes"
              });
            });
        });
      });
    }
  });
});

router.post("/authenticate/", (req, res) => {
  /* Gets user by email */
  User.getUserByEmail(req.body.email, (err, user) => {
    /* Checks if there is an user with that email address */
    if (user) {
      /* Then checks the password hash */
      User.comparePassword(req.body.password, user.password, (err, matches) => {
        if (matches) {
          res.status(200).json({ error: false });
        } else {
          res
            .status(400)
            .json({ error: true, message: "Password does not match." });
        }
      });
    } else {
      res
        .status(400)
        .json({ error: true, message: "No user account with that email." });
    }
  });
});
module.exports = router;
