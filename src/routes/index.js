const siteRouter = require('./siteRoute');
const productRouter = require('./productRoute');
const authRouter = require('./authRoute');

function route(app) {
    // Route Definitions
    app.use('/products', productRouter);

    app.use('/', siteRouter);
    app.use('/', authRouter);

    // Catch-all for 404 errors
    app.use((req, res) => {
        res.status(404).render('404', { title: 'Page Not Found' });
    });
}

module.exports = route;
