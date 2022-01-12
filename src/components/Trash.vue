<template>
  <div id="trash-detail">
    <h1>{{msg}} : {{ $route.params.noteId }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      msg: '回收站笔记详情页'
    }
  }
}
</script>

<style scoped>
h1 {
  color: blue;
}
</style>