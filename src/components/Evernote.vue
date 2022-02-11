<template>
  <div class="layout">
    <Sidebar/>
    <NotesSide/>
  </div>
</template>
<script setup>
import Sidebar from './Sidebar.vue'
import NotesSide from './Notebook.vue'

</script>
<style scoped lang="less">
.layout {
  display: flex;
  flex-direction: row;
}
</style>

