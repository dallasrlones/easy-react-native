import userService from './users.js';
import redis from 'redis';
import Jwt from 'jsonwebtoken';

const redisUser = process.env.REDIS_USER;
const redisPassword = process.env.REDIS_PASSWORD;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisConnectionString = `redis://:${redisPassword}@${redisHost}:${redisPort}`;

const TOKEN_EXPIRATION_SECONDS = 3600; // 1 hour, might want to make this days, or reset the expiration on each request

const runRedisCommand = (cb) => {
    const client = redis.createClient({ url: redisConnectionString });

    const close = () => {
        client.quit();
    };

    client.connect().then(() => {
        cb(client, close);
    }).catch(err => {
        console.log(err)
        client.close();
    });
};

const storeItem = (key, value) => {    
    console.log(`store item ${key} ${value}`)

    return new Promise((resolve, reject) => {
        runRedisCommand((client, close) => {
            client.set(key, value, 'EX', TOKEN_EXPIRATION_SECONDS).then(() => {
                close();
                resolve();
            }).catch(err => {
                close();
                reject(err);
            });
        });
    });
    
};

const getItem = (key) => {
    return new Promise((resolve, reject) => {
        // redisClient().get(key).then(result => resolve(result)).catch(err => reject(err));
        runRedisCommand((client, close) => {
            client.get(key).then(result => {
                close();
                resolve(result);
            }).catch(err => {
                close();
                reject(err);
            });
        });
    });
};

const storeRefreshToken = (refreshToken, userId) => {
    return storeItem(refreshToken, userId);
};

const generateJwtToken = (payload) => {
    const token = Jwt.sign(payload, process.env.JWT_SECRET || 'shitsack', {
        expiresIn: process.env.JWT_EXPIRES_IN || '1hr',
    });
    return token;
};

const createSignedToken = (user) => {
    return Jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyJwtValid = (token) => {
    return new Promise((resolve, reject) => {
        Jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

const getUserIdFromRefreshToken = (refreshToken) => {
    // return getItem(refreshToken);
    return new Promise((resolve, reject) => {
        getItem(refreshToken).then(result => {
            result = result.split("<^>")[1];
            resolve(result);
        }).catch(err => reject(err));
    });
};

const removeRefreshToken = (refreshTokenId) => {
    return new Promise((resolve, reject) => {
        runRedisCommand((client, close) => {
            client.del(refreshTokenId).then(() => {
                close();
                resolve();
            }).catch(err => {
                close();
                reject(err);
            });
        });
    });
};

const generateRandomToken = () => {
    const tokenLength = 32;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < tokenLength; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
};

const generateAndStoreRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const refreshToken = generateRandomToken();
        storeRefreshToken(refreshToken, userId).then(() => {
            resolve(refreshToken);
        }).catch(err => reject(err));
    });
};

export default {
    storeRefreshToken,
    getUserIdFromRefreshToken,
    removeRefreshToken,
    generateAndStoreRefreshToken,
    generateJwtToken,
    verifyJwtValid,
    createSignedToken
};