import userActions from './userActions.js';

const actions = {
    ...userActions,
    'INFO_TIP': (req, res) => {
        res.json({ success: true, message: 'this is an info tip' });
    }
};

export default actions;