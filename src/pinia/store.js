import {defineStore} from 'pinia'
import {notebookUrl, noteUrl} from '../apis/url'
import request from '../helpers/request'
import {ElMessage, ElMessageBox} from 'element-plus'

export const useStore = defineStore({
    id: 'store',
    state: () => ({
        notebooks: null, // 笔记本列表
        notebook: null, // 当前笔记本
        notes: [], // 当前笔记本对应的笔记列表
        note: null, // 当前笔记本中正在展示的笔记的 id
    }),
    getters: {
        // 默认的笔记本列表，其他排序方式暂时不考虑
        notebookList: (state) => state.notebooks || [],
        // 当前展示的笔记本
        curNotebook: (state) => state.notebook || {},
        // 笔记列表，默认以更新时间排序
        noteList: (state) => state.notes || [],
        // 当前展示的笔记
        curNote: (state) => state.note || {title: '', content: ''},
    },
    actions: {
        // prompt 类型的提示
        promptBox(title, message, inputDefaultValue = null) {
            return ElMessageBox.prompt(message, title, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^.{1,30}$/,
                inputValue: inputDefaultValue,
                inputErrorMessage: '标题不能为空，且不超过30个字符',
                customClass: 'customClass',
                cancelButtonClass: 'cancelButtonClass',
                confirmButtonClass: 'confirmButtonClass',
            })
        },
        // confirm 类型的提示
        confirmBox(title, message) {
            return ElMessageBox.confirm(message, title, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'customClass',
                cancelButtonClass: 'cancelButtonClass',
                confirmButtonClass: 'confirmButtonClass',
                type: 'warning'
            })
        },
        // 获取笔记本列表
        getNotebookList() {
            // 如果笔记本列表获取过了，就不用再次获取了，返回一个成功状态的 Promise 即可，方便后面的 then()操作
            if (this.notebooks !== null) return Promise.resolve()
            // 返回一个 new Promise 向后端发起请求 request(对应的请求接口)，成功后获取到笔记本列表
            return new Promise((resolve, reject) => {
                request(notebookUrl.GET).then(res => {
                    // 按照创建的时间排序
                    res.data = res.data.sort((a, b) => (b.createdAt === a.createdAt ? 0 : a.createdAt < b.createdAt ? 1 : -1))
                    resolve(res)
                }).catch(err => reject(err))
                // 将获取到的值赋值给 原始的notebooks
            }).then(res => {
                this.notebooks = res.data
                this.setCurNotebook()  // 设置列表中第一个为默认展示的笔记本
            })
        },
        addNotebook() {
            // 调用提示框
            this.promptBox('创建笔记本', '输入新笔记本的标题').then(({value}) => {
                // 向服务器发送请求，value为用户输入的标题
                return new Promise((resolve, reject) => {
                    request(notebookUrl.ADD, 'POST', {title: value}).then(res => resolve(res)).catch(err => reject(err))
                }).then(res => {
                    // 插入到列表的第一个位置
                    this.notebooks.unshift(res.data)
                    // 弹出提示
                    ElMessage.success(res.msg)
                    // 更改当前笔记本为刚创建的笔记本
                    this.notebook = this.notebooks[0]
                })
            })
        },
        deleteNotebook() {
            // 调用 confirm 确认框，
            this.confirmBox('删除笔记本', '确认要删除该笔记本吗').then(() => {
                return request(notebookUrl.DELETE.replace(':id', this.notebook.id), 'DELETE')
            }).then(res => {
                // 更新列表，移除已删除项
                this.notebooks = this.notebooks.filter(notebook => notebook.id !== this.notebook.id)
                // 设置当前笔记本为删除项的下一个，否则为第一个
                this.notebook = this.notebooks[this.notebookList.indexOf(this.notebook) + 1] || this.notebooks[0]
                ElMessage.success(res.msg)
            })
        },
        editNotebookTitle() {
            this.promptBox('修改笔记本', '输入新笔记本的标题', this.notebook.title).then(({value}) => {
                return request(notebookUrl.UPDATE.replace(':id', this.notebook.id), 'PATCH', {title: value}).then(() => {
                    // 找到该笔记本，修改title
                    let notebook = this.notebooks.find(notebook => notebook.id === this.notebook.id) || {}
                    notebook.title = value
                })
            })
        },
        // 设置当前的笔记本
        setCurNotebook(selectedNotebookId = null) {
            this.notebook = this.notebooks.find(notebook => notebook.id === selectedNotebookId) || this.notebooks[0]
            // 根据当前笔记本，获取笔记列表
            return new Promise((resolve, reject) => {
                request(noteUrl.GET.replace(':notebookId', this.notebook.id))
                    .then(res => { // 按更新时间排序
                        res.data = res.data.sort((a, b) => (b.updatedAt === a.updatedAt ? 0 : a.updatedAt < b.updatedAt ? 1 : -1))
                        resolve(res)
                    }).catch(err => reject(err))
            }).then(res => {
                this.notes = res.data
                this.setCurNote() // 设置笔记列表中第一个为默认展示的笔记
            })
        },
        // 修改排序方式
        creationTimeNoteList() {this.notes = this.notes.sort((a, b) => (b.createdAt === a.createdAt ? 0 : a.createdAt < b.createdAt ? 1 : -1))},
        recentUpdateNoteList() {this.notes = this.notes.sort((a, b) => (b.updatedAt === a.updatedAt ? 0 : a.updatedAt < b.updatedAt ? 1 : -1))},
        AlphabeticallyNoteList() {this.notes = this.notes.sort((a, b) => (b.title === a.title ? 0 : a.title < b.title ? 1 : -1))},

        setCurNote(selectedNoteId = null) {
            this.note = this.notes.find(note => note.id === selectedNoteId) || this.notes[0]
        },
        addNote({title = '', content = ''} = {title: '', content: ''}) {
            return new Promise((resolve, reject) => {
                request(noteUrl.ADD.replace(':notebookId', this.notebook.id), 'POST', {title, content})
                    .then(res => resolve(res)).catch(err => {reject(err)})
            }).then(res => {
                this.notes.unshift(res.data)
                this.note = this.notes[0]
            })
        },
        updateNote() {
            return request(noteUrl.UPDATE.replace(':noteId', this.note.id), 'PATCH', {
                title: this.curNote.title,
                content: this.curNote.content
            }).then(() => {
                console.log('更新了')
                console.log(this.note.content)
                let note = this.notes.find(note => note.id === this.curNote.id) || {}
                note.title = this.curNote.title
                note.content = this.curNote.content
            })
        },
        deleteNote() {
            return request(noteUrl.DELETE.replace(':noteId', this.note.id), 'DELETE').then(() => {
                // 更新列表，移除已删除项
                this.notes = this.notes.filter(note => note.id !== this.note.id)
                // 设置当前笔记 为删除项的下一个，否则为第一个
                this.note = this.notes[this.notes.indexOf(this.note) + 1] || this.notes[0]
            })
        },
    }
})