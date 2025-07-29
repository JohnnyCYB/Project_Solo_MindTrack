const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const USERS_FILE = path.join(__dirname, "../data/users.json");

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Login form
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// Handle login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    res.redirect("/journal/dashboard");
  } else {
    res.render("login", { error: "Invalid username or password" });
  }
});

// Registration form
router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

// Handle registration
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  if (users.find(u => u.username === username)) {
    return res.render("register", { error: "Username already exists" });
  }
  users.push({ username, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.redirect("/login");
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
