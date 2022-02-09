<template>
  <aside>
    <el-header>
      <span class="page-title">极客笔记</span>
    </el-header>
    <Avatars/>
    <!--菜单menu，默认激活 ’默认笔记本‘ 的index，默认打开的 sub-menu 的 index 的数组，需要修改-->
    <el-menu default-active="3" :default-openeds="['2']" background-color="#161B22">
      <!--创建笔记本-->
      <el-menu-item index="1" class="addNotebook" @click="store.addNotebook()">
        <Plus class="styleIcon"/>
        <span>创建笔记本</span>
      </el-menu-item>
      <!--笔记本列表-->
      <el-sub-menu index="2">
        <template #title>
          <Folder class="styleIcon"/>
          <span>我的笔记本</span></template>
        <el-scrollbar max-height="250px">
          <el-menu-item v-for="notebook in store.notebookList" :key="notebook.id"
                        :index="notebook.id.toString()" :class="{active:notebook.id === store.curNotebook.id}"
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
        <Delete class="styleIcon"/>
        <span>回收站</span>
      </el-menu-item>
      <el-menu-item index="4">
        <div @click="user.logout()">退出登录</div>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup>
import Avatars from './Avatars.vue'
import {Folder, Notebook, Delete, Plus} from '@element-plus/icons-vue'
import {useStore} from '../pinia/store'
import {useUser} from '../pinia/user'

const user = useUser()
const store = useStore()
store.getNotebookList() // 获取到所有的笔记本列表 创建时执行
</script>

<style lang="less" scoped>
@import (inline) "../assets/google-fonts.css";

@bg-color: #161B22;
@title-shadow: #42fff6;

aside {
  width: 210px; //再小笔记本列表会有横向滚动条
  height: 100vh;
  min-height: 500px;
  background-color: @bg-color;


  .el-header {
    display: flex;
    width: 100%;
    height: 50px;
    background: #161B22;
    border-bottom: 1px solid #333;
    padding-top: 5px;
    color: #ffffff;

    .page-title {
      font: 400 40px 'ZhiMangXing-Regular', cursive;
      color: #ffffff;
      text-shadow: 0 0 5px @title-shadow, 0 0 10px @title-shadow, 0 0 20px @title-shadow, 0 0 30px @title-shadow;
    }
  }

  .el-menu {
    margin-top: 50px;
  }

  .el-menu, .el-sub-menu, .el-menu-item {
    border: none;
  }

  .el-menu-item {
    display: flex;
    align-items: center;
    height: 40px;

    &.active {
      background: #21252B;
    }
  }

  .addNotebook:active {
    background: #4D78CC;
  }

  .styleIcon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }

  .title-wrapper {
    display: flex;
    align-items: center;
    height: 40px;

    .notebookTitle {
      width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>