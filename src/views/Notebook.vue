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
              <li @click.stop.prevent="store.deleteNotebook()">删除</li>
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
              <span>{{ friendlyDate(note.updatedAt) }}</span>
            </div>
            <Delete class="delete-note-icon" @click="store.deleteNote()"/>
          </div>
        </li>
      </ol>
    </el-scrollbar>
  </div>
  <div id="note-edit">
    <header class="edit-header">
      <input class="edit-note-title" type="text" v-model="store.curNote.title" @input="onUpdateNote"
             @keydown="statusText='正在输入'"
             placeholder="添加标题">
      <span class="edit-status">{{ statusText }}</span>
    </header>
    <v-md-editor v-model="store.curNote.content" @input="onUpdateNote" @inputRead="statusText='正在输入...'"
                 height="calc(100vh - 40px)"/>
  </div>
</template>

<script setup>
import {Delete, UploadFilled, MoreFilled} from '@element-plus/icons-vue'
import {useStore} from '../pinia/store'
import {friendlyDate} from '../helpers/util'
import _ from 'lodash' // 防抖
import {ref} from 'vue'

const store = useStore()
const statusText = ref('未改动')

store.checkLogin

const onUpdateNote = _.debounce(function () {
  if (!store.curNote.id) return
  store.updateNote().then(data => {
    statusText.value = '已保存'
  }).catch(data => {
    statusText.value = '保存出错'
  })
  console.log(statusText.value)
}, 1000)

</script>

<style scoped lang="less" src="../assets/notebook.less"/>