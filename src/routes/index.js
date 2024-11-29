const siteRouter = require('./siteRoute');
const productRouter = require('./productRoute');
const authRouter = require('./authRoute');
const connectEnsureLogin = require('connect-ensure-login');

function route(app) {

    app.use(function(req, res, next) {
        res.locals.user = req.user || null; // Attach `req.user` to `res.locals.user`
        next();
    });
    
    // Route Definitions
    app.use('/products', productRouter);

    app.use('/cart', connectEnsureLogin.ensureLoggedIn(
        { setReturnTo: true }
    ) ,(req, res) => {
        // Logic to add the product to the cart goes here
        // Return a success message
        res.json({ message: 'Product has been added to cart successfully' });
    });
    app.use('/', authRouter);

    app.use('/', siteRouter);


    // Catch-all for 404 errors
    app.use((req, res) => {
        res.status(404).render('404', { title: 'Page Not Found' });
    });
}

module.exports = route;
