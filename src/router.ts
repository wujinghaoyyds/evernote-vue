import {createRouter, createWebHashHistory} from 'vue-router';  // 只能用这种方式引用：https://juejin.cn/post/7053708332523061255/
import login from './components/Login.vue';
import evernote from './components/Evernote.vue';

const routes = [
    {path: '/evernote', component: evernote},
    {path: '/login', component: login},
    {path: '/', component: login},
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
});
export default router;