const express = require("express");
const session = require("express-session");
const path = require("path");
const authRoutes = require("./routes/auth");
const journalRoutes = require("./routes/journal");

const app = express();

// View engine
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: "mindtrack-secret-key",
  resave: false,
  saveUninitialized: true
}));

// Expose session to all templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Routes
app.use("/", authRoutes);
app.use("/journal", journalRoutes);

// Dashboard (protected)
app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  // latestEntry is loaded in journalRoutes; reuse here if needed
  res.redirect("/journal/dashboard");
});

// Graph (protected, static demo)
app.get("/graph", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("graph");
});

// Home
app.get("/", (req, res) => {
  res.render("index");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
