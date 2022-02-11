// 与后端约定的请求接口

const notebookUrl = {
    GET: '/notebooks',
    ADD: '/notebooks',
    UPDATE: '/notebooks/:id',
    DELETE: './notebooks/:id'
}
const noteUrl = {
    GET: '/notes/from/:notebookId',
    ADD: '/notes/to/:notebookId',
    UPDATE: '/notes/:noteId',
    DELETE: '/notes/:noteId'
}
const userUrl = {
    REGISTER: '/auth/register',  // 注册
    LOGIN: '/auth/login',        // 登录
    LOGOUT: '/auth/logout',      // 注销
    GET_INFO: '/auth'            // 获取用户信息
}

const trashUrl = {
    GET: '/notes/trash',
    REVERT: '/notes/:noteId/revert',
    DELETE: '/notes/:noteId/confirm'
}
export {notebookUrl, noteUrl, userUrl, trashUrl}