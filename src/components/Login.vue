<template> <!--登录注册 组件-->
  <main id="page-bg"> <!-- 整体背景，为一张图片 -->
    <h1 class="page-title">晨旭笔记</h1>
    <div class="form"> <!-- 登录注册整体表单 -->
      <nav class="page-tabs"> <!-- 登录注册Tabs,根据布尔值，对应的class为"show"，click 交换两个值，数组解构赋值-->
        <h2 :class="{show:displayLogin}" @click="[displayLogin,displayRegister] = [displayRegister, displayLogin]">
          登录</h2>
        <h2 :class="{show:displayRegister}" @click="[displayLogin,displayRegister] = [displayRegister, displayLogin]">
          注册</h2>
      </nav>
      <section class="login" v-if="displayLogin">
        <input v-model="login.username" type="text" placeholder="用户名">
        <input v-model="login.password" type="password" placeholder="密码">
        <p :class="{error: login.isError}"> {{ errorTip }}</p>
        <button @click="onLogin">登录</button>
      </section>
      <section class="register" v-if="displayRegister">
        <input v-model="register.username" type="text" placeholder="设置用户名" @input="check(register)">
        <input v-model="register.password" @input="check(register)" placeholder="设置密码" type="password">
        <p :class="{error: register.isError}"> {{ errorTip }}</p>
        <button @click="onRegister">注册</button>
      </section>
    </div>
  </main>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {useUser} from '../pinia/user'

const displayLogin = ref(true)     // 是否展示登录页面
const displayRegister = ref(false) // 是否展示注册页面
const errorTip = ref(null)
const login = reactive({
  username: '',   // 用户输入的用户名
  password: '',   // 用户输入密码
  isError: false  // 是否出错
})
const register = reactive({
  username: '',
  password: '',
  isError: false
})
const user = useUser()

const check = (checkObj) => { // 检查用户的输入是否符合要求
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
const onLogin = () => { // 登录页面，监听登录 button 的 click 事件，
  check(login)
  // 向服务器发送请求，成功的话跳转到笔记本列表页面，失败的话显示提示
  user.login({username: login.username, password: login.password}).catch((data) => {
    login.isError = true
    errorTip.value = data.msg
  })
}
const onRegister = () => { // 注册页面，监听注册 button 的 click 事件，
  check(register)
  user.register({username: register.username, password: register.password}).catch((data) => {
    register.isError = true
    errorTip.value = data.msg
  })
}
</script>

<style lang="less" scoped>
@import (inline) "../assets/google-fonts.css";

#page-bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: url(../../public/evernote-bg.jpg) center no-repeat rgba(0, 0, 0, 0.7);
  background-size: cover;

  .page-title {
    font: 1000 50px 'ZhiMangXing-Regular', cursive;
    color: rgba(250, 250, 250, 0.9);
    position: absolute;
    top: 12%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.form {
  width: 400px;
  height: 380px;
  padding: 40px 50px 0 50px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;

  .page-tabs {
    display: flex;
    justify-content: center;

    h2 {
      font-size: 20px;
      margin: 0 15px;
      padding: 8px 0;
      width: 20%;
      text-align: center;
      cursor: pointer;
      color: #999;
      border-bottom: 2px solid rgba(0, 0, 0, 0);

      &.show {
        color: #EA6F5A;
        border-bottom: 2px solid #EA6F5A;
      }
    }
  }

  .login, .register {
    margin-top: 20px;
    display: flex;
    flex-direction: column;

    input {
      margin-top: 20px;
      width: 100%;
      padding: 10px 16px;
      border-radius: 4px;
      font-size: 16px;
      outline: 1px solid #777;
      border: none;
      background: rgba(0, 0, 0, 0.2);
      color: #f0f0f0;
    }

    input:hover {
      outline: 2px solid #999;
      background: rgba(0, 0, 0, 0.4);
    }

    input:focus {
      outline: 2px solid #999;
      background: rgba(0, 0, 0, 0.4);
    }

    p {
      visibility: hidden;
      height: 14px;
      font-size: 12px;
      margin: 10px 0 0 10px;

      &.error {
        color: red;
        visibility: visible;
      }
    }

    button {
      margin-top: 40px;
      width: 100%;
      height: 36px;
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      border-radius: 4px;
      outline: none;
      border: none;
      cursor: pointer;
      color: rgba(255, 255, 255, 08);
      background: rgba(55, 55, 55, 0.6);
    }

    button:hover {
      background: rgba(55, 55, 55, 1);
    }
  }
}
</style>