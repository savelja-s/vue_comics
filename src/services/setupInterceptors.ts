import {api} from "./api";

const getUser = () => {
    return JSON.parse(localStorage.getItem("user") || "{}");
}
const axiosInstance = api.getInstance();
var needWait = false;

const updateRefreshToken = (token: string, store: any) => {
    console.log("TOKEN", token, "STORE", store);
    axiosInstance
        .post("/token/refresh/", {refresh: token})
        .then((response: any) => {
            console.log("refresh", response.data);
            store.commit("user/updateUser", response.data);
        })
        .catch((error: any) => {
            console.log("refresh-error");
            store.commit("user/logout");
        });
}
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
        (err: any) => {
            const originalConfig = err.config;
            console.log("TEST-401", err.config);
            if (err.response.status === 401 && !needWait) {
                const token = getUser().refresh;
                token && updateRefreshToken(token, store);
            }
            // if (originalConfig && originalConfig.url !== "/token/login" && err.response) {
            //     // Access Token was expired
            //     if (err.response.status === 401 && !needWait) {
            //         needWait = true;
            //         try {
            //             const token = getUser().refresh;
            //             if (token) {
            //                 // console.log("err.response", err.response);
            //                 updateRefreshToken(token, store);
            //                 console.log("NEEED TEST");
            //             }
            //             return axiosInstance(originalConfig);
            //         } catch (_error) {
            //             console.log("CATCH");
            //             return Promise.reject(_error);
            //         }
            //     }
            // }
            return Promise.reject(err);
        }
    );
};
export default setup;
