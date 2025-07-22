const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session config
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: true
}));

// Make session available in EJS templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');

app.use('/', authRoutes);
app.use('/journal', journalRoutes);

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
