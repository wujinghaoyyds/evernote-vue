// 用 Axios 发送请求，基于 Promise
import axios from 'axios'
// 使用 Element UI库中的 ElMessage
import {ElMessage} from 'element-plus'
// 修改默认配置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 默认的请求域名
axios.defaults.baseURL = 'https://note-server.hunger-valley.com'
// 跨域请求时是否需要使用凭证，默认false
axios.defaults.withCredentials = true
// 修改默认的 validateStatus（不好搜到，GItHub 文件 defaults.js 中有）或者使用 validateStatus 配置选项，可以自定义抛出错误的 HTTP code，
axios.defaults.validateStatus = (status) => {
    return (status >= 200 && status < 300) || status === 400
}

export default function request(url, type = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
        // 创建请求时的配置选项
        let option = {
            url: url,
            method: type,
        }
        // 对请求方法进行判断，设置作为请求体被发送的数据
        if (type.toLowerCase() === 'get') {
            option.params = data
        } else {
            option.data = data
        }
        // 发送请求
        axios(option).then(res => {
            if (res.status === 200) {  // 成功
                resolve(res.data)
            } else {  // 失败
                // Element UI 消息提示
                ElMessage.error(res.data.msg)
                reject(res.data)
            }
        }).catch(() => {
            ElMessage.error('网络异常')
            reject({msg: '网络异常'})
        })
    })
}