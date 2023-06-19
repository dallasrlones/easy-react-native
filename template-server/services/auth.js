import userService from './users.js';
import bcrypt from 'bcrypt';

const authService = {};

const findUserById = async id => {
    const foundUser = await userService.getUserBy({ id });
    return foundUser;
};
authService.findUserById = findUserById;

const createUser = async (email, password) => {
    console.log(`user service - create user - email: ${email}, password: ${password}`)
    try {
        if (!password) {
            throw new Error('Password is required.');
        }

        const encryptedPass = await bcrypt.hash(password, 10);
        const results = await userService.createUser({ email, password: encryptedPass });
        return results;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

authService.createUser = createUser;

const authenticateUser = async (email, pass) => {
    return new Promise((resolve, reject) => {
        userService.getUserBy({ email }).then(foundUser => {
            if (!foundUser || !foundUser.password) {
                reject(false);
            }
        
            bcrypt.compare(pass, foundUser.password).then(match => {
                resolve(match);
            });
        });
    });
};
authService.authenticateUser = authenticateUser;

const userExists = (email) => {
    return new Promise((resolve, reject) => {
        userService.userEmailExists(email).then(userId => {
            resolve(userId);
        }).catch(reject);
    });
};
authService.userExists = userExists;

export {
    authService as default,
    findUserById,
    createUser,
    authenticateUser,
    userExists
};