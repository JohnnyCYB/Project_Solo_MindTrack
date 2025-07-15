const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/journal', (req, res) => res.render('journal'));
app.get('/dashboard', (req, res) => res.render('dashboard'));

const port = 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));