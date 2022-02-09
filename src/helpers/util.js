// 对时间格式进行处理，转换为多久之前
import {ElMessageBox} from 'element-plus'

const friendlyDate = function (date) {
    // 对传入的 时间 进行判断，类型是否为 object
    const dateObj = typeof date === 'object' ? date : new Date(date)
    // 获取对应的时间戳，方便计算和现在的差值
    const time = dateObj.getTime()
    // 获取当前的时间戳，
    const now = Date.now()
    let space = now - time
    let str = ''

    switch (true) {
        case space < 60000:
            str = '刚刚'
            break
        case space < 1000 * 3600:
            str = Math.floor(space / 60000) + '分钟前'
            break
        case space < 1000 * 3600 * 24:
            str = Math.floor(space / (1000 * 3600)) + '小时前'
            break
        default:
            str = Math.floor(space / (1000 * 3600 * 24)) + '天前'
    }
    return str
}
export {friendlyDate}