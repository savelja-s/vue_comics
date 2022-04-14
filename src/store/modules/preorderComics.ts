import {api} from "@/services/api";
import {PreorderComic} from "@/types";

const state = {
    preorderComics: [],
    preorderComicsLatest: [],
    preorderComic: {},
};
const mutations = {
    setPreorderList(state: any, list: PreorderComic[]) {
        state.preorderComics = list;
    },
    setComicLatest(state: any, payload: any) {
        state.preorderComicsLatest = payload;
    },
    setComic(state: any, comics: PreorderComic) {
        state.preorderComic = comics;
    },
};
const getters = {
    // getLatest: (state, getters) => () => {
    //     return axios
    //         .get("http://comics-site:85/api/v1/preorder-comics/latest/")
    //         .then(response => {
    //             console.log('response', response);
    //             let result = [];
    //             response.data.forEach(function (value) {
    //                 console.log(value, "value");
    //             });
    //             return result;
    //         })
    //         .catch(error => {
    //             console.log('ERROR', error)
    //         });
    // }
};
const actions = {
    async getById({commit}: { commit: any }, id: string) {
        const comic = await api.get(`/preorder-comics/${id}/`);
        commit("setComic", comic);
    },
    async getByParams({commit}: { commit: any }, params: any) {
        const url = `/${params.product_type}/${params.publisher_slug}/${params.product_slug}/`;
        const comic: PreorderComic = await api.get(url);
        commit("setComic", comic);
    },
    async getPreorderListByParams({commit}: { commit: any }, params: any) {
        const url = `/${params.product_type}/${params.publisher_slug ? params.publisher_slug + '/' : ''}`;
        const data: any = await api.get(url);
        const comics: PreorderComic[] = data.results;
        commit("setPreorderList", comics);
    },
    async getLatest({commit}: { commit: any }, params: object = {}) {
        await api
            .getInstance()
            .get("/preorder-comics/latest/")
            .then((response: any) => {
                const result: [] = response.data;
                const comics: PreorderComic[] = [];
                result.forEach(function (value: any) {
                    const comic: PreorderComic = value;
                    comics.push(comic);
                });
                console.log("result", result, params);
                commit("setComicLatest", comics);
            })
            .catch((error: any) => console.log(error));
    },
    // async fetchApi({commit}) {
    //     const res = await axios.get()
    // }
};
export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};
