const jwt = require("jsonwebtoken");
const fs = require("fs");

const authenticate = (req, res, next) => {
    fs.readFile('token.txt', 'utf8', (err, token) => {
        if (err) {
            return res.status(500).send("Please login first");
        }

        if (token) {
            jwt.verify(token, 'imran', (err, decoded) => {
                if (decoded) {
                    console.log(decoded);
                    next();
                } else {
                    res.status(401).send("Login failed: Invalid token");
                }
            });
        } else {
            res.status(401).send("Please login: No token found");
        }
    });
};

module.exports = {
    authenticate
};
