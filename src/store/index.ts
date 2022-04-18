import {createStore} from "vuex";
import product from "./modules/product";
import user from "./modules/user";
import publisher from "./modules/publisher";

export default createStore({
    modules: {product, user, publisher},
});
