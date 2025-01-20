import axios from 'axios';

let isRefreshing = false;
let subscribers = [];

const onTokenRefreshed = (newToken) => {
    subscribers.forEach((callback) => callback(newToken));
    subscribers = [];
};

const addSubscriber = (callback) => {
    subscribers.push(callback);
};

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        if (response?.status === 401 && !config._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addSubscriber((newToken) => {
                        config.headers.Authorization = `Bearer ${newToken}`;
                        resolve(axios(config));
                    });
                });
            }

            config._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const refreshResponse = await axios.post("/auth/refresh-token", {
                    refreshToken,
                });

                const newToken = refreshResponse.data.token;
                localStorage.setItem("token", newToken);
                setAuthHeader(newToken);

                isRefreshing = false;
                onTokenRefreshed(newToken);

                return axios(config);
            } catch (refreshError) {
                isRefreshing = false;
                logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const getAuthToken = () => {
    return window.localStorage.getItem('token');
};

export const setAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};

/*export const setAuthHeader = (token) => {
    if (token !== null) {
        window.localStorage.setItem("auth_token", token);
    } else {
        window.localStorage.removeItem("auth_token");
    }
};*/

axios.defaults.baseURL = 'https://localhost:8443';

axios.defaults.headers.post['Content-Type'] = 'application/json';

export const request = (method, url, data = null, options = {}) => {
    const headers = {
        ...options.headers,
        Authorization: options.headers?.Authorization || `Bearer ${getAuthToken()}`,
    };

    return axios({
        method,
        url,
        data,
        headers,
    });
};

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setAuthHeader(null);
};