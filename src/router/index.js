import {createRouter, createWebHashHistory} from 'vue-router'  // 只能用这种方式引用，bug并解决：https://juejin.cn/post/7053708332523061255/
import Login from '../components/Login.vue'
import NotebookList from '../components/NotebookList.vue'
import NoteDetail from '../components/NoteDetail.vue'
import TrashDetail from '../components/Trash.vue'


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/login', component: Login},
        {path: '/notebooks', component: NotebookList},
        {path: '/note', component: NoteDetail},
        {path: '/trash', component: TrashDetail}
    ]
})
export default router