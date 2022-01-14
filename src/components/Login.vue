<!--登录注册 组件-->
<template>
  <main id="login-page" class="pageBg"> <!-- 整体背景，蒙层 -->
    <article class="form"> <!-- 登录注册整体表单 -->
      <nav class="page-nav"><!-- 登录注册切换，带数据绑定的 class 显示对应的样式 -->
        <h2 v-bind:class="{show:isShowLogin}" v-on:click="showLogin">登录</h2>
        <h2 v-bind:class="{show:isShowRegister}" v-on:click="showRegister">注册</h2>
      </nav>
      <section class="login" v-show="isShowLogin"> <!-- 登录页面，条件渲染，只是切换元素的 display CSS property -->
        <input v-model="login.username" type="text" placeholder="用户名">
        <input v-model="login.password" @keyup.enter="onLogin" type="password" placeholder="密码">
        <p v-bind:class="{error: login.isError}"> {{ login.notice }}</p><!-- 登录错误提示 -->
        <button v-on:click="onLogin" class="loginButton">登录</button><!-- 对应页面表单提交的按钮 -->
      </section>
      <section class="register" v-show="isShowRegister"><!-- 注册页面 -->
        <input v-model="register.username" @input="isValidRegisterUsername" type="text" placeholder="设置用户名">
        <input v-model="register.password" @input="isValidRegisterPassword" @keyup.enter="onRegister" type="password"
               placeholder="设置密码">
        <p v-bind:class="{error: register.isError}"> {{ register.notice }}</p><!-- 注册错误提示 -->
        <button v-on:click="onRegister" class="registerButton">注册</button>
      </section>
    </article>
  </main>
</template>

<script>

import Auth from '../helpers/auth'
import Bus from '../helpers/bus'

Auth.getInfo().then(data => {console.log(data)})

export default {
  data() {
    return {
      isShowLogin: true,  // 是否展示登录页面，默认展示登录页面
      isShowRegister: false,  // 是否展示注册页面，默认不展示
      login: {  // 登录
        username: '',  // 获取用户输入的用户名
        password: '',  // 获取用户输入密码
        notice: '占位',  // 提示，需要占一定的的空间，不然增加时页面样式会有变动（原来为空的话，突增一行东西有变化）
        isError: false  // 是否出错；为true时，<p>标签会有class="error"，对应的内容会显示
      },
      register: {  // 注册
        username: '',
        password: '',
        notice: '占位',
        isError: false
      }
    }
  },
  methods: {
    // 展示登录页面，监听对应 <h2> 标签的 click 事件
    showLogin() {
      this.isShowLogin = true
      this.isShowRegister = false
    },
    // 展示注册页面
    showRegister() {
      this.isShowLogin = false
      this.isShowRegister = true
    },
    // 注册页面，监听 input 事件，判断用户设置用户名 过程中 是否符合要求
    isValidRegisterUsername() {
      // 对用户名进行正则表达式检查，错误时将显示用户格式的的要求提示
      if (!/^[\w\u4e00-\u9fa5]{3,15}$/.test(this.register.username)) {
        this.register.isError = true
        this.register.notice = '用户名3~15个字符，支持字母、数字、中文'
        return
      }
      this.register.isError = false
      this.register.notice = '占位'
    },
    // 注册页面，监听 input 事件，判断用户设置密码 过程中 是否符合要求
    isValidRegisterPassword() {
      // 对密码进行正则表达式检查，错误时将显示密码不符合要求的提示
      if (!/^.{6,16}$/.test(this.register.password)) {
        this.register.isError = true
        this.register.notice = '密码长度为6~16个字符'
        return
      }
      this.register.isError = false
      this.register.notice = '占位'
    },
    // 登录页面，监听登录 button 的 click 事件，
    onLogin() {
      // 对用户名和密码进行格式检查
      if (!/^[\w\u4e00-\u9fa5]{3,15}$/.test(this.login.username)) {
        this.login.isError = true
        this.login.notice = '用户名3~15个字符，支持字母、数字、中文'
        return
      }
      if (!/^.{6,16}$/.test(this.login.password)) {
        this.login.isError = true
        this.login.notice = '密码长度为6~16个字符'
        return
      }
      // 向服务器发送请求，成功的话跳转到笔记本列表页面，失败的话显示提示
      Auth.login({
        username: this.login.username,
        password: this.login.password
      }).then(() => {
        this.login.isError = false
        this.login.notice = '占位'
        // 调用方法，发起数据传递，到 Avatars 组件中，更新用户名的第一个字母，默认是”未“登录
        Bus.emit('userInfo', {username: this.login.username})
        this.$router.push({path: 'notebooks'})
      }).catch((data) => {
        this.login.isError = true
        this.login.notice = data.msg
      })
    },
    // 注册页面，监听注册 button 的 click 事件，
    onRegister() {
      // 对用户输入的用户名和密码进行格式检查
      if (!/^[\w\u4e00-\u9fa5]{3,15}$/.test(this.register.username)) {
        this.register.isError = true
        this.register.notice = '用户名3~15个字符，支持字母、数字、中文'
        return
      }
      if (!/^.{6,16}$/.test(this.register.password)) {
        this.register.isError = true
        this.register.notice = '密码长度为6~16个字符'
        return
      }
      // 向服务器发送请求，成功的话跳转到笔记本列表页面，失败的话显示提示
      Auth.register({
        username: this.register.username,
        password: this.register.password
      }).then(() => {
        this.register.isError = false
        this.register.notice = '占位'
        // 调用方法，发起数据传递，到 Avatars 组件中，更新用户名的第一个字母，默认是”未“登录
        Bus.emit('userInfo', {username: this.register.username})
        this.$router.push({path: 'notebooks'})
      }).catch((data) => {
        this.register.isError = true
        this.register.notice = data.msg
      })
    },
  }
}

</script>

<style lang="less" scoped>

.pageBg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
}

.form {
  width: 360px;
  height: 400px;
  color: #333;
  background: #fff;
  display: flex;
  flex-direction: column;

  .page-nav {
    margin-top: 30px;
    display: flex;
    justify-content: center;

    h2 {
      margin: 0 15px;
      width: 20%;
      padding: 12px 0;
      text-align: center;
      cursor: pointer;
      font-weight: normal;
      color: #999;

      &.show {
        border-bottom: 2px solid #EA6F5A;
        color: #EA6F5A;
        font-weight: bolder;
      }
    }
  }

  .login, .register {
    margin-top: 20px;
    padding: 0 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    input {
      margin-top: 30px;
      width: 100%;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      border: 1px solid #999;
      box-shadow: 1px 1px 5px 1px #999;
    }

    input:focus {
      border: 1px solid rgb(54, 52, 51);
      box-shadow: 1px 1px 5px 1px rgb(54, 52, 51);
    }

    p {
      visibility: hidden;
      font-size: 12px;
      margin-top: 10px;
      width: 95%;
    }

    .error {
      color: red;
      visibility: visible;
    }

    button {
      margin-top: 40px;
      width: 50%;
      height: 36px;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      border-radius: 36px;
      outline: none;
      border: none;
      cursor: pointer;
      color: #FFFFFF;

      &.loginButton {
        background: #3194D0;
      }

      &.registerButton {
        background: #2DBE61;
      }
    }
  }
}
</style>