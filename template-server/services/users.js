import { getItem, getItemBy, insertItem } from './psql.js';

const userService = {};

const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        getItem('users', id).then((user) => {
            resolve(user);
        }).catch(reject);
    });
};
userService.getUserById = getUserById;

const getUserBy = (props) => {
    return new Promise((resolve, reject) => {
        getItemBy({ table: 'users', props }).then((user) => {
            resolve(user);
        }).catch(reject);
    });
};
userService.getUserBy = getUserBy;

const userEmailExists = (email) => {
    return new Promise((resolve, reject) => {
        getItemBy({ table: 'users', props: { email } }).then((user) => {
            resolve(user == null ? null : user.id);
        }).catch(reject);
    });
};
userService.userEmailExists = userEmailExists;

const createUser = (props) => {
    return new Promise((resolve, reject) => {
        insertItem('users', props).then((user) => {
            resolve(user);
        }).catch(reject);
    });
};
userService.createUser = createUser;

export {
    userService as default,
    getUserById,
    getUserBy,
    userEmailExists,
    createUser
};