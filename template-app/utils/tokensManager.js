// async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

const TokensManager = tokenNames => {
    const tokensManager = {};

    const setToken = token => {
        return new Promise((resolve, reject) => AsyncStorage.setItem(tokenNames.token, token).then(resolve).catch(reject));
    };
    tokensManager.setToken = setToken;

    const getToken = () => {
        return new Promise((resolve, reject) => AsyncStorage.getItem(tokenNames.token).then(resolve).catch(reject));
    };
    tokensManager.getToken = getToken;

    const setRefreshToken = refreshToken => {
        return new Promise((resolve, reject) => AsyncStorage.setItem(tokenNames.refreshToken, refreshToken).then(resolve).catch(reject));
    };
    tokensManager.setRefreshToken = setRefreshToken;

    const getRefreshToken = () => {
        return new Promise((resolve, reject) => AsyncStorage.getItem(tokenNames.refreshToken).then(refreshToken => resolve(refreshToken)).catch(reject));
    };
    tokensManager.getRefreshToken = getRefreshToken;

    const clearTokens = () => {
        return new Promise((resolve, reject) => AsyncStorage.removeItem(tokenNames.token).then(() => {
            AsyncStorage.removeItem(tokenNames.refreshToken).then(resolve).catch(reject);
        }).catch(reject));
    };
    tokensManager.clearTokens = clearTokens;

    const setTokensInStorage = ({ token, refreshToken }) => {
        return new Promise((resolve, reject) => {
            setToken(token).then(() => {
                setRefreshToken(refreshToken).then(() => {
                    resolve();
                }).catch(err => {
                    alert(err.message);
                    reject(err)
                });
            }).catch(err => {
                alert(err.message)
            });
        });
    };
    tokensManager.setTokensInStorage = setTokensInStorage;
    
    return tokensManager;
};

const tokenExists = token => {
    return new Promise((resolve, reject) => AsyncStorage.getItem(token).then(res => {
        if (res === null) {
            resolve(false);
        } else {
            resolve(true);
        }
    }).catch(reject));
};

export {
    TokensManager as default,
    tokenExists
};