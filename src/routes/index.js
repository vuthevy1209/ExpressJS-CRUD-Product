const siteRouter = require('./siteRoute');
const productRouter = require('./productRoute');
const authRouter = require('./authRoute');
const passport = require('passport');
const cartMiddleware = require('../middleware/cart');


function route(app) {


    // Middleware for authentication and passing user data to views
    app.use((req, res, next) => {
        if (req.cookies.user) {
            res.locals.user = req.cookies.user;
        }
        next();
    });

    // app.use('/protected', passport.authenticate('jwt', { session: false }),
    //     (req, res, next) => {
    //         if (req.error) {
    //             authMiddleware.refreshToken(req, res, next);
    //             if (req.authError) {
    //                 res.redirect('/404');
    //             }
    //             console.log('You are authenticated');
    //             res.redirect('/404'); // Haven't implemented this UI yet
    //         }
    //         console.log('You are authenticated');
    //         res.redirect('/404'); // Haven't implemented this UI yet
    //     }
    // );


    // Kết hợp các Middleware
    app.use('/cart', (req, res, next) => {cartMiddleware.allMiddleware(req, res, next)});




    // Route Definitions
    app.use('/products', productRouter);

    app.use('/', authRouter);

    app.use('/', siteRouter);

    // Catch-all for 404 errors
    app.use((req, res) => {
        res.status(404).render('404', { title: 'Page Not Found' });
    });
}

module.exports = route;
