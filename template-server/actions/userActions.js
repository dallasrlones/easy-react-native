import userService from '../services/users.js';

const userActions = {};

userActions.GET_USER = (req, res) => {
  res.json({ success: true, user: req.user });
};

export default userActions;
