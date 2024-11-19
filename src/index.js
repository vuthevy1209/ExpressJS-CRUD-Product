const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const router = require('./routes/index.js');
const db = require('./config/database');
const hbsHelpers = require('handlebars-helpers');
const passport = require('./config/auth/passport.js'); // Adjust the path as needed
const cookieParser = require('cookie-parser');
// const {checkAuth,authorize} = require('./middleware/auth.js');

const hbs = engine({
    extname: '.hbs',
    helpers: hbsHelpers(),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

// Connect to DB
db.connect();

const app = express();
const port = 3000;

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(passport.initialize());

// app.use(checkAuth);

// Template engine
app.engine('.hbs', hbs);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Route init
router(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
