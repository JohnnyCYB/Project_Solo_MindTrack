const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const ENTRIES_FILE = path.join(__dirname, "../data/entries.json");

function loadAllEntries() {
  if (!fs.existsSync(ENTRIES_FILE)) return [];
  return JSON.parse(fs.readFileSync(ENTRIES_FILE));
}

function saveAllEntries(entries) {
  fs.writeFileSync(ENTRIES_FILE, JSON.stringify(entries, null, 2));
}

// GET /journal → list + new-entry form
router.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  let entries = loadAllEntries()
    .filter(e => e.username === req.session.user.username)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.render("journal", { entries });
});

// POST /journal → add a new entry
router.post("/", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const { text, rating } = req.body;
  const all = loadAllEntries();
  all.push({
    username: req.session.user.username,
    date: new Date().toISOString().split("T")[0],
    text,
    rating: Number(rating)
  });
  saveAllEntries(all);
  res.redirect("/journal");
});

// GET /journal/dashboard → dashboard view
router.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const all = loadAllEntries().filter(e => e.username === req.session.user.username);
  const latestEntry = all.length ? all[0] : null;
  res.render("dashboard", { latestEntry });
});

// GET /journal/calendar → calendar view
router.get("/calendar", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  let entries = loadAllEntries()
    .filter(e => e.username === req.session.user.username)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  // keep only date + emoji mapping
  const emojiMap = { 5: "😃", 4: "🙂", 3: "😐", 2: "🙁", 1: "😢" };
  const calEntries = entries.map(e => ({
    date: e.date,
    emoji: emojiMap[e.rating] || "😐"
  }));
  res.render("calendar", { entries: calEntries });
});

module.exports = router;
