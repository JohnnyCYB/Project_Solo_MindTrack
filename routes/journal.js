const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Fake journal storage (in memory)
let journalEntries = [];

router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const promptFile = path.join(__dirname, '../data/prompts.json');
  const prompts = JSON.parse(fs.readFileSync(promptFile));
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  
  res.render('journal', { prompt: randomPrompt, entries: journalEntries });
});

router.post('/', (req, res) => {
  const { date, mood, entry } = req.body;
  journalEntries.push({ date, mood, entry });
  res.redirect('/journal');
});

router.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('dashboard', { entries: journalEntries });
});

router.get('/calendar', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const calendarMap = {};
  journalEntries.forEach(entry => {
    calendarMap[entry.date] = entry.mood;
  });

  res.render('calendar', { calendarMap });
});

module.exports = router;
