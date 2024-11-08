const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const router = require('./routes/index.js');
const db = require('./config/database');
const hbsHelpers = require('handlebars-helpers');

const hbs = engine({
    extname: '.hbs',
    helpers: hbsHelpers()
});

// Connect to DB
db.connect();

const app = express();
const port = 3000;

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Template engine
app.engine('.hbs', hbs);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Route init
router(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
