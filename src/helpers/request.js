// 用 Axios 发送请求，基于 Promise
import axios from 'axios'
// 修改默认配置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 默认的请求域名
axios.defaults.baseURL = 'https://note-server.hunger-valley.com'
// 跨域请求时是否需要使用凭证，默认false
axios.defaults.withCredentials = true

export default function request(url, type = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
        // 创建请求时的配置选项
        let option = {
            url: url,
            method: type,
            // 使用 validateStatus 配置选项，可以自定义抛出错误的 HTTP code，
            validateStatus: function (status) {
                return (status >= 200 && status < 300) || status === 400
            }
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
                reject(res.data)
            }
        }).catch(err => {
            reject({msg: '网络异常'})
            console.log(err)
        })
    })
}