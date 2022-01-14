// 接口封装成 API 便于统一维护管理
import request from './request'
// 设置各种请求的路径，方便管理
const URL = {
    REGISTER: '/auth/register',  // 注册
    LOGIN: '/auth/login',  // 登录
    LOGOUT: '/auth/logout',  // 注销
    GET_INFO: '/auth'  // 获取用户信息
}
export default {
    // 注册API
    register({username, password}) {
        return request(URL.REGISTER, 'POST', {username, password})
    },
    // 登录 API
    login({username, password}) {
        return request(URL.LOGIN, 'POST', {username, password})
    },
    // 注销 API
    logout() {
        return request(URL.LOGOUT)
    },
    // 获取用户信息 API
    getInfo() {
        return request(URL.GET_INFO)
    }
}