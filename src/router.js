import {createRouter, createWebHashHistory} from 'vue-router'
import Login from './components/Login.vue'
import NotebookList from './components/NotebookList.vue'
import NoteDetail from './components/NoteDetail.vue'
import TrashDetail from './components/Trash.vue'

const history = createWebHashHistory()

export const router = createRouter({
    history: history,
    routes: [
        {path: '/login', component: Login},
        {path: '/notebooks', component: NotebookList},
        {path: '/note/:noteId', component: NoteDetail},
        {path: '/trash/:noteId', component: TrashDetail}
    ]
})
