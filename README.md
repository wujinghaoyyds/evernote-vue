## 技术栈

- vue: 3.2.25
- vite: 2.7.2
- vue-router: 4.0.12
- less: 4.1.2
- pinia: 2.0.11
- axios: 0.24.0
- element-plus: 1.3.0-beta.5
- v-md-editor: 2.3.13
- lodash: 4.17.21

## 整体结构分析

### 一、 注册、登录功能的实现

1.模块展示

两者在同一个页面里，用v-if来决定展示哪个模块，在两个`<h2>`中监听直接转换对应的值

```vue
<h2 @click="[displayLogin,displayRegister] = [displayRegister, displayLogin]"></h2>

const displayLogin = ref(true)     // 是否展示登录页面
const displayRegister = ref(false) // 是否展示注册页面
```

2. 输入格式判断

用v-model监听表达的输入，在前端判断输入的内容是否满足要求。用正则表达式对其判断，如果错误，通过改变`isError`来决定是否显示错误提示，通过动态绑定class来显示样式。

```vue
 <p :class="{error: login.isError}"> {{ errorTip }}</p>
```

注册表单监听 input 事件，在输入过程中就一直检查。登录没有。

```js
const check = (checkObj) => {
    if (!/^[\w\u4e00-\u9fa5]{3,15}$/.test(checkObj.username)) {
        checkObj.isError = true
        errorTip.value = '用户名为3~15个字符，支持 _ 、字母、数字、中文'
        return
    }
    if (!/^.{6,16}$/.test(checkObj.password)) {
        checkObj.isError = true
        errorTip.value = '密码长度为6~16个字符'
        return
    }
    checkObj.isError = false
    errorTip.value = null
}
```

3. 发送请求

监听对应按钮的 click 事件，执行函数，首先检查输入的内容，然后发送请求，如果出错，显示对应的错误提示

### 二、sidebar 侧边栏

1. 用户名展示

登录后展示用户名 `user.username`，并检查用户的登录状态，

```js
user.checkLogin()
setInterval(function () {user.checkLogin()}, 120000)
```

2. 创建笔记本

```vue

<el-menu-item index="1" class="addNotebook" @click="store.addNotebook()">
<Plus class="styleIcon"/>
<span>创建笔记本</span>
</el-menu-item>
```

3. 笔记本列表

用 element UI库中 menu 组件，默认打开第二项`:default-openeds="['2']"`。

用 v-for 遍历 `store.notebookList`， 点击后修改当前展示的笔记本，以此用`:class="{}"`动态绑定当前活动项的样式。点击时设置该项为 curNotebook

```vue

<el-menu-item v-for="notebook in store.notebookList" :index="notebook.id.toString()" :key="notebook.id"
              :class="{active:notebook.id === store.curNotebook.id}"
              @click="store.setCurNotebook(notebook.id)">
<div class="title-wrapper">
  <Notebook class="styleIcon"/>
  <span class="notebookTitle">{{ notebook.title }}</span>
</div>
</el-menu-item>
```

在 created 生命周期中执行获取到笔记本列表函数，对此进行判断，如果返回的笔记本列表为空，则应该是新用户，则创建一个默认笔记本，并创建一个笔记 “欢迎使用晨旭笔记”。

```js
store.getNotebookList().then(() => {
    if (store.notebookList.length === 0) {
        store.initialize().then(() => {
            store.addNote({title: '欢迎适应晨旭笔记', content: '欢迎欢迎，热烈欢迎'})
            store.getNotebookList()
        })
    }
})
```

3. 回收站

用 elementUI 中 drawer 来展示回收站组件，监听 @open 事件，获取回收站笔记列表。

遍历列表，渲染回收笔记标题，更新事件，所属笔记本，操作；操作中有彻底删除按钮和恢复按钮。

```vue

<button @click="store.deleteTrashNote(trashNote.id)">彻底删除</button>
<button @click="store.revertTrashNote(trashNote)">恢复</button>
```

4.退出登录

```vue

<el-menu-item index="4">
<SwitchButton class="styleIcon"/>
<span @click="user.logout()">退出登录</span>
</el-menu-item>
```

### 二、笔记

#### 笔记本相关信息

根据 curNotebook 来展示笔记本标题和获取笔记列表，用tooltip 来展示对笔记本的操作：修改笔记本标题、删除和排序。

根据笔记列表的长度来得知笔记的数量，以及往里面添加笔记

#### 笔记相关

每一项上展示笔记标题，更新时间和一个删除按钮。样式上 hover 后或点击后当前一项的 bottom-border 会隐藏。

笔记编写区域，分为笔记标题编写区和笔记内容编写区域，

```vue

<header class="edit-header">
<input class="edit-note-title" type="text" v-model="store.curNote.title" @input="onUpdateNote"
       placeholder="添加标题">
<span class="edit-status">{{ statusText }}</span>
</header>
<v-md-editor v-model="store.curNote.content" @change="onUpdateNote" @save="saved" height="calc(100vh - 40px)"/>
```

引用lodash 中 debounce防抖函数，当用户停止编辑后，发送请求

```js
const onUpdateNote = _.debounce(function () {
    if (!store.curNote.id) return
    store.updateNote().then().catch(() => {statusText.value = '保存出错'})
}, 3000)
```

### 三、后端请求

#### 用 Axios 发送请求，基于 Promise
```js
import axios from 'axios'
import {ElMessage} from 'element-plus'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = 默认的请求域名
axios.defaults.withCredentials = true
axios.defaults.validateStatus = (status) => {
    return (status >= 200 && status < 300) || status === 400
}

export default function request(url, type = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
        let option = {
            url: url,
            method: type,
        }
        if (type.toLowerCase() === 'get') {
            option.params = data
        } else {
            option.data = data
        }
        axios(option).then(res => {
            if (res.status === 200) {
                resolve(res.data)
            } else {
                ElMessage.error(res.data.msg)
                reject(res.data)
            }
        }).catch(() => {
            ElMessage.error('网络异常')
            reject({msg: '网络异常'})
        })
    })
}
```

#### 与后端约定的请求接口
```js
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
```

### 四、pinia 状态管理

#### 1. 用户相关 

- 用户名
- 注册
- 登录
- 注销
- 检查登录

#### 2. 笔记
1. 笔记本

    - 获取笔记本列表 
    - 删除、增加笔记本
    - 修改笔记本标题 
    - 设置当前笔记本

2. 笔记

    - 获取笔记列表 
    - 设置当前笔记 
    - 删除、增加、修改笔记

3. 回收站
    - 获取回收站笔记列表，
    - 彻底删除和恢复笔记