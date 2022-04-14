import {createStore} from "vuex";
import PreopderComics from "./modules/preorderComics";
import user from "./modules/user";

export default createStore({
    modules: {PreopderComics, user},
});
