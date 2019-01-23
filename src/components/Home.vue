<template>
  <div id="home" class="row h-100">
    <navigation :source="source"></navigation>
    <div class="body col-sm p-0">
      <div class="row">
        <div class="col p-0 search-bar shadow-sm">
          <div class="row h-100 align-items-center">
            <div class="col p-0 h-100 text-right search-container">
              <img class="search-icon" :src="require('../assets/search.png')">
              <input type="text" class="beacon-search" placeholder="Search for beacon">
            </div>
          </div>
          <div class="user-login row align-items-center">
            <div class="user-name col text-right">Admin</div>
          </div>
        </div>
      </div>
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script>
import Navigation from './Navigation'

export default {
  props: {
    source: ''
  },
  components: {
    Navigation
  },
  name: 'Home'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.body {
  position: relative;
  z-index: 99;
}

.search-bar {
  height: 70px;
  position: relative;
}

.user-login {
  height: 100%;
  width: 200px;
  position: absolute;
  right: 0;
  top: 0;
}

.beacon-search {
  height: 100%;
  width: 100%;
  color: #666666;
  border: none;
  padding-left: 50px;
}

.search-container {
  position: relative;
}

.search-icon {
  top: 20px;
  left: 10px;
  position: absolute;
  height: 30px;
  width: 30px;
  opacity: 0.3;
}
</style>
