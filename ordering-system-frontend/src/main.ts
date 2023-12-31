import { createApp } from "vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "@/style/index.css";
import "element-plus/theme-chalk/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import App from "./App.vue";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

import vant from "vant";
import "vant/lib/index.css";
app.use(vant);

app.use(store).use(router).use(ElementPlus).mount("#app");
