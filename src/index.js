const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars'); // Import đúng engine từ express-handlebars
const router = require('./routes/index.js');
const db = require('./config/database');
const hbsHelpers = require('handlebars-helpers'); // Cài helpers

// Khai báo Handlebars với helpers
const hbs = engine({
    extname: '.hbs',  // Đảm bảo rằng tệp template có phần mở rộng là .hbs
    helpers: hbsHelpers() // Đăng ký tất cả helpers, bao gồm extend
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
app.engine('.hbs', hbs);  // Cấu hình engine với express-handlebars
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Route init
router(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
