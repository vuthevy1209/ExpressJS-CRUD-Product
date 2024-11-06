const siteRouter = require('./siteRoute');
const productRoter = require('./productRoute');
const userRouter = require('./userRoute');

function route(app) {

    app.use('/GA03', userRouter);

    app.use('/products', productRoter);

    app.use('/', siteRouter);

}

module.exports = route;
