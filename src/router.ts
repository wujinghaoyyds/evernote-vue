import {createRouter, createWebHashHistory} from 'vue-router';  // 只能用这种方式引用：https://juejin.cn/post/7053708332523061255/
import login from './views/Login.vue';
import TrashDetail from './components/Trash.vue';
import Notebook from './views/Evernote.vue';

const routes = [
    {path: '/note', component: Notebook},
    {path: '/login', name: 'login', component: login},
    {path: '/trash', name: 'TrashDetail', component: TrashDetail}
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
});
export default router;