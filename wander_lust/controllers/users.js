// controllers/users.js
// Handles user registration, login, and logout logic

const User = require("../models/user.js");

// ── Render Signup Form ────────────────────────────────────────────────────────
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// ── Handle Signup ─────────────────────────────────────────────────────────────
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    // Auto-login after registration
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome to Wanderlust, ${registeredUser.username}!`);
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

// ── Render Login Form ─────────────────────────────────────────────────────────
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// ── Handle Login ──────────────────────────────────────────────────────────────
// passport.authenticate handles validation; this runs after success
module.exports.login = async (req, res) => {
  req.flash("success", `Welcome back, ${req.user.username}!`);
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// ── Handle Logout ─────────────────────────────────────────────────────────────
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have been logged out. See you soon!");
    res.redirect("/listings");
  });
};
