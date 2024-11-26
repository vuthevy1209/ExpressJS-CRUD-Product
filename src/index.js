const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars'); // Add this line
const router = require('./routes/index.js');
const db = require('./config/database');
const hbsHelpers = require('handlebars-helpers');
const passport = require('./config/auth/passport.js'); // Adjust the path as needed

var session = require('express-session');

var MongoStore = require('connect-mongo');

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

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://root:ABC123@ga03.dhlfb.mongodb.net/test_auth?retryWrites=true&w=majority&appName=test_auth",
        collectionName: 'sessions', // Optional, default is 'sessions'
      }),
  }));

app.use(passport.authenticate('session'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());


// Template engine
app.engine('.hbs', hbs);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Register Handlebars as the view engine
app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    helpers: {
        includes: function(array, value) {
            return array && array.includes(value);
        }
    }
}));

// Route init
router(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});