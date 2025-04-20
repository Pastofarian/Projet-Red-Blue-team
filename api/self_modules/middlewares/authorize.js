const jwt = require('jsonwebtoken');

module.exports = (req, res, callback) => {
    // Vulnerability injection: accept JWTs without a signature
    jwt.verify(
        req.headers.token,
        '',                           // no key
        { algorithms: ['none'] },     // accept alg: none
        (error, payload) => {
            if (error) {
                res.status(500).send(error + '. Please contact the webmaster');
            } else {
                req.body.user_id = payload.userId;
                req.body.user_role = payload.role;
                callback();
            }
        }
    );
}
