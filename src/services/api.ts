import axios from "axios";
import {ElNotification} from 'element-plus'
import store from "../store";

var _retry = false;
const states: any = store?.state;
const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
const catchNotificationError = (error: any) => {
    console.log(error);
    ElNotification({
        title: "Something wrong.",
        message: error,
        type: "error",
    });
}
const catchError = (error: any) => {
    const response = error.response;
    // if (response.status === 401 && !_retry) {
    //     _retry = true;
    //     updateRefreshToken(states.user.user.refresh, states);
    // } else {
    //     // catchNotificationError(error);
    // }
}
export const api = {
    getInstance() {
        return axiosInstance;
    },
    get(url: string, params = {}) {
        return axiosInstance
            .get(url, params)
            .then((response: any) => response.data)
            .catch((error: any) => catchNotificationError(error));
    },
    post(url: string, params = {}) {
        return axiosInstance
            .post(url, params)
            .then((response: any) => response.data)
            .catch((error: any) => catchNotificationError(error));
    },
};
