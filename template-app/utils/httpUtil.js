import axios from 'axios';

const httpUtil = {};

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
        axios.post(url, payload, headers).then((res) => {
            resolve(res.data)
        }).catch(err => {
            alert(JSON.stringify(err))
            reject(err)
        });
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


// SETUP PROTECT HTTP UTIL

const setupProtectedHttpUtil = ({ tokenNames, baseUrl, tokensManager }) => {
    const { getToken, getRefreshToken, setTokensInStorage } = tokensManager;

    const fetchTokenOrLogOut = () => {

        return new Promise((resolve, reject) => {
            getToken().then((token) => {
                if (token) {
                    resolve(token);
                } else {
                    reject();
                }
            }).catch(err => {
                reject(err);
            });
        });
    };

    const requestHandler = (resolve, reject, type, url, payload) => {
        return (res) => {
            // alert(JSON.stringify(res))
            if (res.success == false) {
                if (res.message == 'EXPIRED') {
                    REFRESH().then((res) => {
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

    const GET = () => (url) => {
        return new Promise((resolve, reject) => {
            fetchTokenOrLogOut().then((token) => {
                httpUtil.GET(baseUrl + url, authorizationHeader(token)).then(requestHandler(resolve, reject, 'GET', url)).catch(reject);
            }).catch(reject);
        });
    };

    const PUT = (url, payload) => {
        return new Promise((resolve, reject) => {
            fetchTokenOrLogOut().then((token) => {
                httpUtil.PUT(baseUrl + url, authorizationHeader(token), payload).then(requestHandler(resolve, reject, 'PUT', url, payload)).catch(reject);
            }).catch(reject);
        });
    };

    const POST = (url, payload) => {
        return new Promise((resolve, reject) => {
            fetchTokenOrLogOut().then((token) => {
                httpUtil.POST(baseUrl + url, authorizationHeader(token), payload).then(requestHandler(resolve, reject, 'POST', url, payload)).catch(reject);
            }).catch(reject);
        });
    };

    const DELETE = (url) => {
        return new Promise((resolve, reject) => {
            fetchTokenOrLogOut().then((token) => {
                httpUtil.DELETE(baseUrl + url, authorizationHeader(token)).then(requestHandler(resolve, reject, 'DELETE', url)).catch(reject);
            }).catch(reject);
        });
    };

    const PAYLOAD = (action, payload = {}) => {
        return new Promise((resolve, reject) => {
            fetchTokenOrLogOut().then((token) => {
                httpUtil.POST(baseUrl + '/payload', authorizationHeader(token), { action }, payload).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    const REFRESH = () => {
        return new Promise((resolve, reject) => {
            getRefreshToken().then((refreshToken) => {
                httpUtil.GET(baseUrl + httpUtil.routes.refresh, { headers: { Authorization: `Bearer ${refreshToken}` } }).then((res) => {
                    if (res.success == true) {
                        setTokensInStorage({ token: res.token, refreshToken: res.refreshToken }).then(() => {
                            resolve({ token: res.token, refreshToken: res.refresh });
                        }).catch(reject);
                    } else {
                        reject();
                    }
                }).catch(reject);
            }).catch(reject);
        });
    }

    return {
        GET,
        PUT,
        POST,
        DELETE,
        PAYLOAD,
    };
};

export {
    httpUtil as default,
    setupProtectedHttpUtil
}