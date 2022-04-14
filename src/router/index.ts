import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import AboutView from "../views/AboutView.vue";
import LoginPage from "../views/LoginPage.vue";
import PageNotFound from "../views/PageNotFound.vue";
import ComicDetail from "../views/ComicDetailPage.vue";
import Product from "../views/Product.vue";
import Category from "../views/Category.vue";
import Search from "../views/Search.vue";
import Cart from "../views/Cart.vue";
import SignUp from "../views/SignUp.vue";
import LogIn from "../views/LogIn.vue";
import MyAccount from "../views/MyAccount.vue";
import Checkout from "../views/Checkout.vue";
import Success from "../views/Success.vue";
import store from "../store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Home,
    // meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { redirectToHome: true },
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
    // meta: {requiresAuth: true},
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: PageNotFound,
    meta: { title: "Not found" },
  },
  {
    path: "/comic-detail/:id",
    name: "comic-detail",
    component: ComicDetail,
    // meta: {requiresAuth: true},
  },
  // {
  //     path: '/sign-up',
  //     name: 'SignUp',
  //     component: SignUp
  // },
  // {
  //     path: '/log-in',
  //     name: 'LogIn',
  //     component: LogIn
  // },
  // {
  //     path: '/my-account',
  //     name: 'MyAccount',
  //     component: MyAccount,
  //     meta: {
  //         requiresAuth: true
  //     }
  // },
  // {
  //     path: '/search',
  //     name: 'Search',
  //     component: Search
  // },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
  // {
  //     path: '/cart/success',
  //     name: 'Success',
  //     component: Success
  // },
  {
    path: "/cart/checkout",
    name: "Checkout",
    component: Checkout,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:product_type/:publisher_slug/:product_slug",
    name: "product-preorder",
    component: Product,
    meta: {
      title: "Preorder Comics",
    },
  },
  {
    path: "/preorder-comics/:publisher_slug?",
    name: "preorder-comics",
    component: Category,
    meta: {
      title: "Preorder Comics",
    },
  },
  {
    path: "/comics/:publisher_slug?",
    name: "comics",
    component: Category,
    meta: {
      title: "Comics",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const { user }: any = store.state;
  const userStatus = user.status;
  // console.log("userStatus", userStatus);
  /*
   * Let language = to.params.lang;
   * language = language || 'en';
   * i18n.locale = 'en';
   */
  if (
    to.matched.some(
      (record) => record.meta.requiresAuth && !userStatus.isAuthenticated
    )
  ) {
    next({ name: "login", query: { to: to.path } });
    // } else if (to.matched.some((record) => record.meta.redirectToHome)) {
    //     if (authUser.access) {
    //         console.log("GO TO HOME");
    //         next("/");
    //     } else {
    //         next();
    //     }
  } else {
    // console.log("NEXT", to, from, next);
    next();
  }
});

export default router;
