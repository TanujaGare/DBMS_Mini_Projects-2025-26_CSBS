// routes/users.js
// Authentication routes: register, login, logout

const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const usersController = require("../controllers/users.js");

// Register
router
  .route("/register")
  .get(usersController.renderSignupForm)
  .post(wrapAsync(usersController.signup));

// Login
router
  .route("/login")
  .get(usersController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(usersController.login)
  );

// Logout
router.get("/logout", usersController.logout);

module.exports = router;
