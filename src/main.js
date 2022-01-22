import {createApp} from 'vue'
// 使用 Element UI库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/index'


const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')