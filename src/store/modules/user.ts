import { CartItem, Cart } from "@/types";

const user = JSON.parse(localStorage.getItem("user") || "{}");
const cart = JSON.parse(localStorage.getItem("cart") || "{}");
const viewMode = localStorage.getItem("viewMode") !== "false";
const state = {
  status: {
    isAuthenticated: !!user.access,
    isLoading: false,
    viewMode: viewMode,
    perPage: localStorage.getItem("perPage") || 8,
    language: localStorage.getItem("language") || "en",
  },
  user: user,
  cart: new Cart(cart.items || []),
};
const getters = {
  cartTotalLength: (state: any, getters: any) => () => {
    return state.cart.items.reduce((acc: number, curVal: CartItem) => {
      return (acc += curVal.quantity);
    }, 0);
  },
  cartTotalPrice: (state: any, getters: any) => () => {
    return state.cart.items.reduce((acc: number, curVal: CartItem) => {
      return (acc += (curVal.product.price_usd || 0) * curVal.quantity);
    }, 0);
  },
};
const mutations = {
  login(state: any, payload: any) {
    state.status.isAuthenticated = !!payload;
    state.user = { ...payload };
    localStorage.setItem("user", JSON.stringify(state.user));
  },
  updateUser(state: any, payload: any) {
    state.status.isAuthenticated = !!payload;
    state.user = { ...state.user, ...payload };
    localStorage.setItem("user", JSON.stringify(state.user));
  },
  addToCart(state: any, item: any) {
    const exists = state.cart.items.filter(
      (i: CartItem) =>
        i.product_type === item.product_type && i.product.id === item.product.id
    );
    if (exists.length)
      exists[0].quantity =
        parseInt(exists[0].quantity) + parseInt(item.quantity);
    else state.cart.items.push(item);
    localStorage.setItem("cart", JSON.stringify(state.cart));
  },
  updateCartItem(state: any, item: any) {
    const exists = state.cart.items.map(
      (i: CartItem) => i.product.id === item.product.id
    );
    if (exists.length) exists[0] = { ...item };
    else state.cart.items.push(item);
    localStorage.setItem("cart", JSON.stringify(state.cart));
  },
  setIsLoading(state: any, status: any) {
    state.isLoading = status;
  },
  logout(state: any) {
    state.user = {};
    state.isAuthenticated = false;
    console.log("logout.state",state);
    localStorage.setItem("user", JSON.stringify(state.user));
  },
  clearCart(state: any) {
    state.cart = { items: [] };
    localStorage.setItem("cart", JSON.stringify(state.cart));
  },
  removeFromCart(state: any, item: any) {
    state.cart.items = state.cart.items.filter(
      (i: CartItem) => i.product.id !== item.product.id
    );
    localStorage.setItem("cart", JSON.stringify(state.cart));
  },
  changeViewMode(state: any) {
    state.status.viewMode = !state.status.viewMode;
    localStorage.setItem("viewMode", state.status.viewMode);
  },
  changeLanguage(state: any, language: any | string) {
    state.status.language = language;
    localStorage.setItem("language", state.status.language);
  },
  changePerPage(state: any, perPage: any | number) {
    state.status.perPage = perPage;
    localStorage.setItem("perPage", state.status.perPage);
  },
};
const actions = {};
export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
