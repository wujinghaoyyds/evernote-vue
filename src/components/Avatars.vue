<template>
  <div class="avatar" :title="`用户名：`+`${user.username}`">
    <Avatar class="userIcon"/>
    <span class="username">{{ user.username }}</span>
  </div>
</template>

<script setup>
import {Avatar} from '@element-plus/icons-vue'
import {useUser} from '../pinia/user'

const user = useUser()
user.checkLogin()
</script>

<style scoped lang="less">
.avatar {
  width: 100%;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .userIcon {
    width: 32px;
    height: 32px;
    padding: 0 2px 3px 2px;
    margin-right: 10px;
    border-radius: 50%;
    color: #455A64;
    background: #C0C4CC;
  }

  .username {
    width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #fff;
    font-size: 16px;
  }
}
</style>