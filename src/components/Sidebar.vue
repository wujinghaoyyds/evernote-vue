<template>
  <aside>
    <el-header><span class="page-title">晨旭笔记</span></el-header>
    <Avatars/>
    <!--菜单menu，默认激活 ’默认笔记本‘ 的index，默认打开的 sub-menu 的 index 的数组，需要修改-->
    <el-menu default-active="2" :default-openeds="['2']" background-color="#161B22">
      <el-menu-item index="1" class="addNotebook" @click="store.addNotebook()"> <!--创建笔记本-->
        <Plus class="styleIcon"/>
        <span>创建笔记本</span>
      </el-menu-item>
      <el-sub-menu index="2">  <!--笔记本列表-->
        <template #title>
          <Folder class="styleIcon"/>
          <span>我的笔记本</span></template>
        <el-scrollbar max-height="200px">
          <el-menu-item v-for="notebook in store.notebookList" :index="notebook.id.toString()" :key="notebook.id"
                        :class="{active:notebook.id === store.curNotebook.id}"
                        @click="store.setCurNotebook(notebook.id)">
            <div class="title-wrapper">
              <Notebook class="styleIcon"/>
              <span class="notebookTitle">{{ notebook.title }}</span>
            </div>
          </el-menu-item>
        </el-scrollbar>
      </el-sub-menu>
      <!--回收站-->
      <el-menu-item index="3">
        <div class="trash-link" @click="drawer = true">
          <Delete class="styleIcon"/>
          <span>回收站</span></div>
        <el-drawer v-model="drawer" title="I am the title" size="calc(100vw - 210px)" modal-class="mask-layer-opacity"
                   :show-close="false" @open="store.getTrashNoteList()">
          <template #title>
            <div class="trash-header">
              <span class="trash-title">回收站共有 {{ store.trashNoteList.length }} 篇笔记</span>
              <div class="trash-info">
                <span>笔记名称</span>
                <span>更新时间</span>
                <span>所属笔记本</span>
                <span>操作</span>
              </div>
            </div>
          </template>
          <template #default>
            <el-scrollbar class="trash-list">
              <ol class="trash-note-list">
                <li v-for="trashNote in store.trashNoteList">
                  <span class="trash-note-title">{{ trashNote.title ? trashNote.title : '<' + '无标题笔记>' }}</span>
                  <span class="last-updated-time">{{
                      new Date(trashNote.updatedAt).toLocaleDateString() + new Date(trashNote.updatedAt).toLocaleTimeString()
                    }}</span>
                  <span>{{ store.trashNoteBelongTo(trashNote.notebookId) }}</span>
                  <span class="trash-more-operations">
                    <button class="completely-delete" @click="store.deleteTrashNote(trashNote.id)">彻底删除</button>
                    <button class="recover" @click="store.revertTrashNote(trashNote)">恢复</button>
                    </span>
                </li>
              </ol>
            </el-scrollbar>
          </template>
        </el-drawer>
      </el-menu-item>
      <el-menu-item index="4">
        <SwitchButton class="styleIcon"/>
        <span @click="user.logout()">退出登录</span>
      </el-menu-item>
      <el-menu-item index="5">
        <a href="https://github.com/wujinghaoyyds/evernote-vue/blob/main/README.md" class="web-intro" target="_blank">
          <Link class="styleIcon"/>
          <span>关于</span>
        </a>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup>
import Avatars from './Avatars.vue'
import {Folder, Notebook, Delete, Plus, SwitchButton, Link} from '@element-plus/icons-vue'
import {useStore} from '../pinia/store'
import {useUser} from '../pinia/user'
import {ref} from 'vue'

const drawer = ref(false)
const user = useUser()
const store = useStore()
// 获取到所有的笔记本列表 创建时执行
store.getNotebookList().then(() => {
  if (store.notebookList.length === 0) {
    store.initialize().then(() => {
      store.addNote({title: '欢迎使用晨旭笔记', content: '欢迎欢迎，热烈欢迎。更多内容查看：https://zhuanlan.zhihu.com/p/466859830'})
      store.getNotebookList()
    })}
})
</script>

<style lang="less" scoped src="../assets/sidebar.less"/>