import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import api from "./services/api";
import ElementPlus from "element-plus";
import * as ElIconModules from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import "@/assets/style/global.scss";
import setupInterceptors from "./services/setupInterceptors";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "@stripe/stripe-js";

setupInterceptors(store);
const app = createApp(App).use(i18n).use(store).use(router);
app.config.globalProperties.api = api;
//TODO: maybe delete
for (const [key, module] of Object.entries(ElIconModules)) {
  app.component(module.name, module);
}
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(ElementPlus).mount("#app");
const options = {
  pk: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY,
  stripeAccount: process.env.VUE_APP_STRIPE_ACCOUNT,
  apiVersion: process.env.VUE_APP_API_VERSION,
  locale: process.env.VUE_APP_I18N_LOCALE,
};
