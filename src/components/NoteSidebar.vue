<template>
  <div class="note-sidebar">
    <span class="btn add-note" @click="addNote" >添加笔记</span>

    <el-dropdown class="notebook-title"  @command="handleCommand" placement="bottom">
      <span class="el-dropdown-link">
        {{curBook.title}} <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
        <el-dropdown-item v-for="notebook in notebooks" :command="notebook.id">{{notebook.title}}</el-dropdown-item>
        <el-dropdown-item  command="trash">回收站</el-dropdown-item>
      </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div class="menu">
      <div>更新时间</div>
      <div>标题</div>
    </div>
    <ul class="notes">
      <li v-for="note in notes">
        <router-link :to="`/note?noteId=${note.id}&notebookId=${curBook.id}`">
          <span class="date">{{note.updatedAtFriendly}}</span>
          <span class="title">{{note.title}}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import Notebooks from '../apis/notebooks'
import Notes from '../apis/notes'
import Bus from '../helpers/bus'

import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const handleCommand = (command) => {
  ElMessage(`click on item ${command}`)
}
export default {
  components:{
    ArrowDown
  },
  created() {
    Notebooks.getAll().then(res => {
          this.notebooks = res.data
          this.curBook = this.notebooks.find(notebook => notebook.id === this.$route.query.notebookId)
              || this.notebooks[0] || {}
          return Notes.getAll({ notebookId: this.curBook.id })
        }).then(res => {
      this.notes = res.data
      this.$emit('update:notes', this.notes)
      Bus.emit('update:notes', this.notes)
    })
  },

  data() {
    return {
      notebooks: [],
      notes:[],
      curBook: {}
    }
  },

  methods: {
    handleCommand(notebookId) {
      if(notebookId === 'trash') {
        return this.$router.push({ path: '/trash'})
      }
      this.curBook = this.notebooks.find(notebook => notebook.id === notebookId)
      Notes.getAll({ notebookId })
          .then(res => {
            this.notes = res.data
            this.$emit('update:notes', this.notes)
          })
    },

    addNote() {
      Notes.addNote({ notebookId: this.curBook.id })
          .then(res => {
            console.log(res)
            this.notes.unshift(res.data)
          })
    }

  }
}

</script>


<style lang="less" >
@import url(../assets/css/note-sidebar.less);

</style>


