const newsRouter = require('./newsRoute');
const siteRouter = require('./siteRoute');
const productRoter = require('./productRoute');

function route(app) {

    app.use('/news', newsRouter); // Co the hieu la dung router nay de chia nho cac router con(tuc la co dang /news/...)

    app.use('/products', productRoter);

    app.use('/', siteRouter);

}

module.exports = route;
