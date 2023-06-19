import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { AppContext } from '../components/State';
import { useContext } from 'react';

const httpUtil = {};

httpUtil.baseUrl = 'http://localhost:3333';
httpUtil.routes = {
    refresh: '/refresh',
};

httpUtil.GET = (url, headers) => {
    return new Promise((resolve, reject) => {
        axios.get(url, headers).then((res) => { resolve(res.data) }).catch(reject);
    });
};

httpUtil.PUT = (url, headers, payload) => {
    return new Promise((resolve, reject) => {
        axios.put(url, payload, headers).then((res) => { resolve(res.data) }).catch(reject);
    });
};

httpUtil.POST = (url, headers, payload) => {
    return new Promise((resolve, reject) => {
        axios.post(url, payload, headers).then((res) => { resolve(res.data) }).catch(reject);
    });
};

httpUtil.DELETE = (url, headers) => {
    return new Promise((resolve, reject) => {
        axios.delete(url, headers).then((res) => { resolve(res.data) }).catch(reject);
    });
};

const authorizationHeader = (token) => {
    return { headers: { Authorization: `Bearer ${token}` } };
};

httpUtil.logOut = (navigation) => {
    AsyncStorage.removeItem('token').then(() => {
        navigation.navigate('Login');
    }).catch(err => alert(err.message));
};

const requestHandler = (resolve, reject, type, url, payload) => {
    return (res) => {
        if (res.success == false) {
            if (res.message == 'EXPIRED') {
                httpUtil.protected.REFRESH().then((res) => {
                    if (type == 'GET') {
                        httpUtil.protected.GET(url).then(resolve).catch(reject);
                    }
                    
                    if (type == 'PUT') {
                        httpUtil.protected.PUT(url, payload).then(resolve).catch(reject);
                    }

                    if (type == 'POST') {
                        httpUtil.protected.POST(url, payload).then(resolve).catch(reject);
                    }

                    if (type == 'DELETE') {
                        httpUtil.protected.DELETE(url).then(resolve).catch(reject);
                    }
                }).catch(reject);
            } else {
                reject();
            }
        } else { resolve(res); }
    };
};

const fetchTokenOrLogOut = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('token').then((token) => {
            if (token) {
                resolve(token);
            } else {
                reject();
            }
        }).catch(reject);
    });
};

httpUtil.protected = {
    SAVETOKEN: (token) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem('token', token).then(resolve).catch(reject);
        });
    },
    SAVEREFRESHTOKEN: (token) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem('refreshToken', token).then(resolve).catch(reject);
        });
    },

    REFRESH: () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('refreshToken').then((refreshToken) => {
                httpUtil.GET(httpUtil.baseUrl + httpUtil.routes.refresh, { headers: { Authorization: `Bearer ${refreshToken}` } }).then((res) => {
                    if (res.success == true) {
                        AsyncStorage.setItem('token', res.token).then(() => {
                            AsyncStorage.setItem('refreshToken', res.refreshToken).then(() => {
                                resolve({ token: res.token, refreshToken: res.refresh });
                            }).catch(reject);
                        }).catch(reject);
                    } else {
                        reject();
                    }
                }).catch(reject);
            }).catch(reject);
        });
    },
    GET: (url) => {
        return new Promise((resolve, reject) => {
            fetchTokenOrLogOut().then((token) => {
                httpUtil.GET(baseUrl + url, authorizationHeader(token)).then(requestHandler(resolve, reject, 'GET', url)).catch(reject);
            }).catch(reject);
        });
    },
    PUT: (url, payload) => {
        return new Promise((resolve, reject) => {
            fetchTokenOrLogOut().then((token) => {
                httpUtil.PUT(baseUrl + url, authorizationHeader(token), payload).then(requestHandler(resolve, reject, 'PUT', url, payload)).catch(reject);
            }).catch(reject);
        });
    },
    POST: (url, payload) => {
        return new Promise((resolve, reject) => {
            fetchTokenOrLogOut().then((token) => {
                httpUtil.POST(baseUrl + url, authorizationHeader(token), payload).then(requestHandler(resolve, reject, 'POST', url, payload)).catch(reject);
            }).catch(reject);
        });
    },
    DELETE: (url) => {
        return new Promise((resolve, reject) => {
            fetchTokenOrLogOut().then((token) => {
                httpUtil.DELETE(baseUrl + url, authorizationHeader(token)).then(requestHandler(resolve, reject, 'DELETE', url)).catch(reject);
            }).catch(reject);
        });
    }
};

export default httpUtil;