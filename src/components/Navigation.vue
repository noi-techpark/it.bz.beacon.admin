<template>
  <!-- eslint-disable -->
  <div id="navigation" class="main-navigation col-sm p-0">
    <nav class="row h-100 align-items-start">
      <div class="col-12 p-0">
        <div class="row">
          <div class="beacon-logo shadow-sm col-12 p-0 text-center">
            <img src="../assets/logo.png" class="align-self-center">
          </div>
        </div>
        <router-link v-for="item in navigationItems" :key="item.id" :class="'row navigation-link pl-3' + ( source === item.title ? ' highlight' : '' )" :to="{name: item.name}">
          <span class="navigation-symbol col"><img :src="require('../assets/' + item.name + '.png')"></span>
          <span class="pl1 navigation-text col">{{ item.title }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    source: ''
  },
  name: 'Navigation',
  data() {
    return {
      navigationItems: [
        {
          name: 'home',
          title: 'Home'
        },
        {
          name: 'home',
          title: 'Issues'
        },
        {
          name: 'users',
          title: 'Users'
        },
        {
          name: 'home',
          title: 'Settings'
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.main-navigation {
  position: relative;
  z-index: 100;
  font-size: 14px;
}

.beacon-logo {
  background-color: #ffffff;
  height: 70px;
  img {
    height: 45px;
    margin-top: 13px;
  }
}

.navigation-symbol {
  max-width: 40px;
  height: 50px;
  padding: 0 11px;
  img {
    height: 22px;
    width: 22px;
  }
}
</style>
