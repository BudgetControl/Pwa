<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import {initFlowbite} from 'flowbite'

export default {
  onMounted() {
    initFlowbite()
}
}
</script>