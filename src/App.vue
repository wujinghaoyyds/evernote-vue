<template>
  <sidebar/>
  <router-view/>
</template>

<script>

import sidebar from './components/Sidebar.vue'

export default {
  name: 'app', components: {
    sidebar
  }
}
</script>

<style>

@import '//at.alicdn.com/t/font_496303_kqrjhri8l25d0a4i.css';
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app {
  height: 100%;
}

body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #eee;
}


a {
  text-decoration: none;
  color: #444;
}

ul, li {
  list-style: none;
}
#app {
  display: flex;
  align-items: stretch;
}
</style>
