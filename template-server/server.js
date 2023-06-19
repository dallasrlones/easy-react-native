import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import authController from './controllers/authController.js';
const { loginHandler, registerHandler, forgotPasswordHandler, decodeJwtMiddleware } = authController;
import actions from './actions/index.js';
// run migrations in ./services/migrations.js feel free to change these to meet your eneds
import './services/migrations.js'

const server = express();
server.use(express.static(path.resolve('./public')));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.get('/', (_req, res) => res.json({ success: true }));

server.post('/login', loginHandler);
server.post('/register', registerHandler);
server.post('/forgot-password', forgotPasswordHandler);

server.post('/payload', decodeJwtMiddleware, (req, res) => {
    const action = actions[req.body.action] || null;
    if (action == null) {
        res.json({ success: false, message: 'action not in there bud, add it to /actions/index' });
    } else {
        delete req.body.action;
        action(req, res);
    }
});

server.listen(process.env.PORT || 1337, err => {
    console.log(err || 'Server running on port 1337')
});