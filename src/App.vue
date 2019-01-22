<template>
  <div id="app" class="container-fluid h-100 p-0">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  html,
  body {
    height: 100%;
  }

  .h-100 {
    min-height: 100%;
  }

  .row {
    padding:0;
    margin: 0;
  }
</style>
