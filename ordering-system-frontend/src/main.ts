import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import '@/style/index.css'
import 'element-plus/theme-chalk/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

//功能函数
import { elMessage } from '@/function/message'
import loading from '@/network/loading'

app.config.globalProperties.$elMessage = elMessage
app.config.globalProperties.$loading = loading

import vant from 'vant';
import 'vant/lib/index.css';
app.use(vant)

app.use(store).use(router).use(ElementPlus).mount('#app')