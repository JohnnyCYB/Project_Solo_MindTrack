const express = require('express');
const router = express.Router();

// Fake in-memory user store
const users = [];

router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  users.push({ username: username.trim().toLowerCase(), password: password.trim() });
  res.redirect('/login');
});

router.get('/login', (req, res) => res.render('login'));

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    u => u.username === username.trim().toLowerCase() && u.password === password.trim()
  );
  if (user) {
    req.session.user = user;
    res.redirect('/journal');
  } else {
    res.send('<h2>Login failed. <a href="/login">Try again</a></h2>');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
