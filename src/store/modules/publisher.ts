import api from "@/services/api";
import { PublisherInterface } from "@/types";

const state = {
  publishers: [],
};
const mutations = {
  setList(state: any, data: any) {
    const results: PublisherInterface[] = [];
    if (data.results) {
      data.results.forEach((value: PublisherInterface) => results.push(value));
    }
    state.publishers = results;
  },
};
const actions = {
  async getListPublisher({ commit }: { commit: any }) {
    const data: any = await api.get("/publisher/");
    data && commit("setList", data);
  },
};
const getters = {};
export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
