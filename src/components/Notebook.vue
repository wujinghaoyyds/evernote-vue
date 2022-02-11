<template>
  <div id="note-sidebar">
    <header class="notebook-info">
      <div class="notebook-related">
        <span class="notebook-title">{{ store.curNotebook.title }}</span>
        <el-tooltip placement="bottom-end" trigger="click" :show-arrow="false" :offset="1">
          <span><MoreFilled class="more-operation-icon"/></span>
          <template #content>
            <ul class="more-operation">
              <li @click.stop.prevent="store.editNotebookTitle()">修改标题</li>
              <li @click.stop.prevent="store.deleteNotebook(store.curNotebook.id)">删除</li>
              <li class="sort-order">排序方式</li>
              <li @click="store.creationTimeNoteList()">创建时间</li>
              <li @click="store.recentUpdateNoteList()">更新时间</li>
              <li @click="store.AlphabeticallyNoteList()">文件名称</li>
            </ul>
          </template>
        </el-tooltip>
      </div>
      <div class="note-related">
        <span>笔记列表（{{ store.noteList.length }}）</span>
        <button class="add-note" @click="store.addNote()">添加笔记</button>
      </div>
    </header>
    <el-scrollbar>
      <ol class="note-list">
        <li v-for="note in store.noteList" key="note.id" :class="{active:note.id === store.curNote.id}"
            @click="store.setCurNote(note.id)">
          <span class="note-title">{{ note.title ? note.title : '<' + '无标题笔记>' }}</span>
          <div>
            <div class="update-time">
              <UploadFilled class="update-icon"/>
              <span>{{
                  new Date(note.updatedAt).toLocaleDateString() + new Date(note.updatedAt).toLocaleTimeString()
                }}</span>
            </div>
            <Delete class="delete-note-icon" @click="store.deleteNote()"/>
          </div>
        </li>
      </ol>
    </el-scrollbar>
  </div>
  <div class="note-empty" v-if="!store.curNote.id">
    <el-empty description="请创建笔记"></el-empty>
  </div>

  <div id="note-edit" v-if="store.curNote.id">
    <header class="edit-header">
      <input class="edit-note-title" type="text" v-model="store.curNote.title" @input="onUpdateNote"
             placeholder="添加标题">
      <span class="edit-status">{{ statusText }}</span>
    </header>
    <v-md-editor v-model="store.curNote.content" @change="onUpdateNote" @save="saved" height="calc(100vh - 40px)"/>
  </div>
</template>

<script setup>
import {Delete, UploadFilled, MoreFilled} from '@element-plus/icons-vue'
import {useStore} from '../pinia/store'
import _ from 'lodash' // 防抖
import {ref} from 'vue'

const store = useStore()
const statusText = ref('笔记将自动保存')

const saved = () => {
  store.updateNote().then(() => {statusText.value = '已保存'}).catch(() => {statusText.value = '保存出错'})
}

const onUpdateNote = _.debounce(function () {
  if (!store.curNote.id) return
  store.updateNote().then().catch(() => {statusText.value = '保存出错'})
}, 3000)

</script>

<style scoped lang="less" src="../assets/notebook.less"/>