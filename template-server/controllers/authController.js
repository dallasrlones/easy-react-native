// const { createSignedToken, generateAndStoreRefreshToken } = require('../services/tokens.js');
// const { createUser, authenticateUser } = require('../services/auth.js');

import userService from '../services/users.js';
import tokens from '../services/tokens.js';
const { createSignedToken, generateAndStoreRefreshToken, verifyJwtValid } = tokens;
import authService from '../services/auth.js';
const { authenticateUser, userExists } = authService;

const basicServerError = (res, location) => {
    return (err) => {
        console.log(`${location} | Error: ${err}`);
        console.log(err);
        res.json({ success: false });
    };
};

const decodeJwtMiddleware = (req, res, next) => {
    let token = req.headers.authorization;
    if (token != undefined) {
        token = token.split(' ')[1];
        verifyJwtValid(token).then((decoded) => {
            userService.getUserById(decoded.id).then(user => {
                if (user != null) {
                    delete user.password;
                    req.user = user;
                    next();
                } else {
                    console.log('user does not exist')
                    res.sendStatus(401);
                }
            }).catch(err => {
                console.log('error validating user exists')
                res.sendStatus(500);
            });
        }).catch((err) => {
            // console.log('error verifying jwt')
            // console.log(err);
            res.json({ success: false, message: 'EXPIRED' });
        });
    } else {
        console.log('no token')
        res.sendStatus(401);
    }
};

const loginHandler = (req, res) => {
    const { email, password } = req.body;

    const missingParams = [];

    if (email == undefined || email == null || email == '') {
        missingParams.push('email');
    }

    if (password == undefined || password == null || password == '') {
        missingParams.push('password');
    }

    if (missingParams.length > 0) {
        res.json({ success: false, message: 'MISSING_PARAMS', missingParams });
        return;
    }
   
    userExists(email).then(userId => {
        if (userId != null) {
            authenticateUser(email, password).then(passwordValid => {
                console.log(`passwordValid: ${passwordValid}`)
                if (passwordValid == true) {
                    console.log(`userExists - userId: ${userId}`)
                    generateAndStoreRefreshToken(userId).then((refreshToken) => {
                        const token = createSignedToken({ id: userId });
                        res.json({ success: true, token, refreshToken });
                    }).catch(basicServerError(res, '/login - generateAndStoreRefreshToken'));
                } else {
                    res.json({ success: false, message: 'INVALID' });
                }
            });
        } else {
            res.json({ success: false, message: '!EXISTS' });
        }
    }).catch(basicServerError(res, '/login - userEmailExists'));
};

const registerHandler = (req, res) => {
    const { email, password } = req.body;

    

    userExists(email).then((exists) => {
        if (exists) {
            res.json({ success: false, message: 'EXISTS' });
        } else {
            authService.createUser(email, password).then(user => {
                res.json({ success: true });
            }).catch(basicServerError(res, '/login - createUser'));
        }
    }).catch(basicServerError(res, '/login - emailExists'));
};

const forgotPasswordHandler = (req, res) => {
    const { email } = req.body;
    userExists(email).then(exists => {
        if (exists) {
            // send email with link to reset password
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'NO_EXISTS' });
        }
    }).catch(basicServerError(res, '/forgot-password - emailExists'));
};

const refreshMiddleware = (req, res, next) => {
    let refreshToken = req.headers.authorization.split(' ')[1];
    getUserIdFromRefreshToken(refreshToken).then(userId => {
        userService.getUserById(userId).then(user => {
            if (user != null) {
                delete user.password;
                req.user = user;
                next();
            } else {
                res.sendStatus(401);
            }
        }).catch(err => {
            res.sendStatus(500);
        });
    }).catch(err => {
        res.sendStatus(401);
    });
};

export default { loginHandler, registerHandler, forgotPasswordHandler, decodeJwtMiddleware, refreshMiddleware }