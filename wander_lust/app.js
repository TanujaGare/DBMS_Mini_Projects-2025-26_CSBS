// app.js
// Main application entry point

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");

// ── Route Imports ─────────────────────────────────────────────────────────────
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/users.js");

// ── MongoDB Connection ─────────────────────────────────────────────────────────
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/wander_lust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ── View Engine ────────────────────────────────────────────────────────────────
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// ── Session Configuration ──────────────────────────────────────────────────────
// Using default in-memory session store for development.
// Safe and simple — no external dependencies. Works with local MongoDB perfectly.
const sessionOptions = {
  secret: process.env.SECRET || "wanderlust_super_secret_key_2024",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ── Passport Setup ─────────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ── Global Template Variables ──────────────────────────────────────────────────
// Makes flash messages and current user available in every EJS template
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // Debug: log every incoming request method, URL, and auth status
  console.log(`[${req.method}] ${req.originalUrl} | user: ${req.user ? req.user.username : 'guest'}`);
  next();
});

// ── Home Route ─────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.statusCode || 500} - ${err.message}`);
  if (err.stack) console.error(err.stack);
  const { statusCode = 500, message = "Something went wrong!" } = err;
  // Pass err to the template so stack trace is visible in development
  res.status(statusCode).render("error.ejs", { statusCode, message, err });
});

// ── Start Server ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Wanderlust running at http://localhost:${PORT}`);
});
