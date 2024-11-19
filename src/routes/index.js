const siteRouter = require('./siteRoute');
const productRouter = require('./productRoute');
const userRouter = require('./userRoute');
const { checkAuth, authorize } = require('../middleware/auth')
const CleanUpService = require('../services/CleanUpService');

function route(app) {


    // Middleware for authentication and passing user data to views
    app.use((req, res, next) => {
        res.locals.user = req.cookies.user;
        next();
    });

    // Protected Route: Renders a view instead of sending JSON
    app.use('/protected', authorize(['Admin', 'User']), (req, res) => {
        checkAuth(req, res, resolve);
        if(req.error){
            CleanUpService.cleanUp(req, res, next);
            // return res.status(401).json({
            //     success: false,
            //     message: 'Unauthorized'
            // });
            res.redirect('/login');
        }
        console.log('You are authorized');
        // res.status(200).json({
        //     success: true,
        //     message: 'Protected Route',
        //     user: req.user
        // });
    });

    // Route Definitions
    app.use('/products', productRouter);

    app.use('/', userRouter);
    
    app.use('/', siteRouter);

    // Catch-all for 404 errors
    app.use((req, res) => {
        res.status(404).render('404', { title: 'Page Not Found' });
    });
}

module.exports = route;
