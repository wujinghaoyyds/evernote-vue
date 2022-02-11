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
user.checkLogin() // 下面的东西第一次不执行，补上，否则会显示未登录
// 必须外面再嵌套一层
setInterval(function () {user.checkLogin()}, 120000)
</script>

<style scoped lang="less">
.avatar {
  width: 100%;
  margin: 16px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .userIcon {
    width: 22px;
    height: 22px;
    margin-right: 8px;
  }

  .username {
    width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #fff;
    font-size: 18px;
  }
}
</style>