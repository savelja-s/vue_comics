import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import ElementPlus from "element-plus";
import * as ElIconModules from '@element-plus/icons-vue'
import "element-plus/dist/index.css";
import "@/assets/style/global.scss";
import setupInterceptors from "./services/setupInterceptors";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

setupInterceptors(store);
const app = createApp(App).use(i18n).use(store).use(router);
//TODO: maybe delete
for (const [key, module] of Object.entries(ElIconModules)) {
    app.component(module.name, module)
}
app.component("font-awesome-icon", FontAwesomeIcon)
app.use(ElementPlus).mount("#app");
