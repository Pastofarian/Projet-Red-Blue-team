const jwt = require('jsonwebtoken');
const logger = require('../middlewares/logger'); // expose logger Winston

module.exports = (req, res, callback) => {
    // vuln: accept JWT without signature
    jwt.verify(
        req.headers.token,
        '',                       // no key
        { algorithms: ['none'] }, // allow alg: none
        (error, payload) => {
            if (error) {
                // bad token => send error
                return res.status(500).send(error + '. Please contact the webmaster');
            }
            // ok token => attach user info
            req.body.user_id   = payload.userId;
            req.body.user_role = payload.role;
            callback();
        }
    );
};
