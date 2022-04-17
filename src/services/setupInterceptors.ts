import {api} from "./api";

const getUser = () => {
    return JSON.parse(localStorage.getItem("user") || "{}");
}
const axiosInstance = api.getInstance();
const setup = (store: any) => {
    axiosInstance.interceptors.request.use(
        (config: any) => {
            const token = getUser().access;
            // console.log("token", token);
            if (token) config.headers["Authorization"] = "Bearer " + token;
            return config;
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );
    axiosInstance.interceptors.response.use(
        (res: any) => res,
        async (err: any) => {
            const originalConfig = err.config;
            // console.log("interceptors.err", originalConfig);
            if (
                originalConfig &&
                originalConfig.url !== "/token/login" &&
                err.response
            ) {
                // Access Token was expired
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;
                    try {
                        const token = getUser().refresh;
                        if (token) {
                            // console.log("err.response", err.response);
                            await axiosInstance
                                .post("/token/refresh/", {refresh: token})
                                .then((response: any) => {
                                    if (response.data) {
                                        // console.log("response.data", response.data);
                                        store.commit('user/updateUser', response.data);
                                    }
                                })
                                .catch((error: any) => {
                                    store.commit('user/logout')
                                });
                            // console.log("NEEED TEST");
                        }
                        return axiosInstance(originalConfig);
                    } catch (_error) {
                        return Promise.reject(_error);
                    }
                }
            }
            return Promise.reject(err);
        }
    );
};
export default setup;
