import {CartItem, Cart} from "@/types";

let user = JSON.parse(localStorage.getItem("user") || "{}");
let cart = JSON.parse(localStorage.getItem("cart") || "{}");
const state = {
    status: {isAuthenticated: !!user.access, isLoading: false},
    user: user,
    cart: new Cart(cart.items || []),
};
const getters = {
    cartTotalLength: (state: any, getters: any) => () => {
        return state.cart.items.reduce((acc: number, curVal: CartItem) => {
            return acc += curVal.quantity
        }, 0)
    },
    cartTotalPrice: (state: any, getters: any) => () => {
        return state.cart.items.reduce((acc: number, curVal: CartItem) => {
            return acc += (curVal.product.price_usd || 0) * curVal.quantity
        }, 0)
    },
};
const mutations = {
    login(state: any, payload: any) {
        state.status.isAuthenticated = !!payload;
        state.user = {...payload};
        localStorage.setItem("user", JSON.stringify(state.user));
    },
    updateUser(state: any, payload: any) {
        state.status.isAuthenticated = !!payload;
        state.user = {...state.user, ...payload};
        localStorage.setItem("user", JSON.stringify(state.user));
    },
    addToCart(state: any, item: any) {
        const exists = state.cart.items.filter(
            (i: CartItem) => i.product_type === item.product_type && i.product.id === item.product.id
        );
        if (exists.length) exists[0].quantity = parseInt(exists[0].quantity) + parseInt(item.quantity);
        else state.cart.items.push(item);
        localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    updateCartItem(state: any, item: any) {
        const exists = state.cart.items.map((i: CartItem) => i.product.id === item.product.id);
        if (exists.length) exists[0] = {...item};
        else state.cart.items.push(item);
        localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    setIsLoading(state: any, status: any) {
        state.isLoading = status;
    },
    logout(state: any) {
        state.user = {};
        state.isAuthenticated = false;
        localStorage.setItem("user", JSON.stringify(state.user));
    },
    clearCart(state: any) {
        state.cart = {items: []};
        localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeFromCart(state: any, item: any) {
        state.cart.items = state.cart.items.filter((i: CartItem) => i.product.id !== item.product.id);
        localStorage.setItem('cart', JSON.stringify(state.cart));
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
