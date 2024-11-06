const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const router = require('./routes/index.js');
const db = require('./config/database');

// Connect to DB
db.connect();

const app = express();
const port = 3000;

// Static file
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTTP logger
// app.use(morgan('combined'));

// Template engine
app.engine('.hbs', engine({
    extname: '.hbs',
    // runtimeOptions: {
    //     allowProtoPropertiesByDefault: true,
    //     allowProtoMethodsByDefault: true,
    // }
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Route init
router(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});