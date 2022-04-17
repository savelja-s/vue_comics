import {createStore} from "vuex";
import product from "./modules/product";
import user from "./modules/user";

export default createStore({
    modules: {product, user},
});
