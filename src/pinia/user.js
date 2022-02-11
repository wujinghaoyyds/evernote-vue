import {defineStore} from 'pinia'
import {userUrl} from '../apis/url'
import router from '../router.ts'
import request from '../apis/request'

export const useUser = defineStore({
    id: 'user',
    state: () => ({
        user: null,
    }),
    getters: {
        username: (state) => state.user === null ? '未登录' : state.user.username,
    },
    actions: {
        login({username, password}) {
            return request(userUrl.LOGIN, 'POST', {username, password}).then(res => {
                this.user = res.data
                router.push({path: '/evernote'}).catch(err => console.log(err))
            })
        },
        register({username, password}) {
            return request(userUrl.REGISTER, 'POST', {username, password}).then(res => {
                this.user = res.data
                router.push({path: '/evernote'}).catch(err => console.log(err))
            })
        },
        // 注销
        logout() {
            return request(userUrl.LOGOUT).then(() => {
                this.user = null
                router.push({path: '/login'}).catch(err => console.log(err))
            })
        },
        checkLogin() {
            // 获取用户信息，根据返回的信息检查是否处在登录状态
            return request(userUrl.GET_INFO).then(res => {
                if (res.isLogin) {
                    this.user = res.data
                } else {
                    router.push({path: '/login'}).catch(err => console.log(err))
                }
            })
        }
    }
})