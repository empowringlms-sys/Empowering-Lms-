// debugMiddleware.js
const debugMiddleware = (req, res, next) => {
    console.log('==================== API Request ====================');
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.originalUrl}`);

    if (Object.keys(req.query).length > 0) {
        console.log('Query Params:', req.query);
    }

    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }

    console.log('Headers:', req.headers);
    console.log('=====================================================');

    next();
};

module.exports = debugMiddleware;
