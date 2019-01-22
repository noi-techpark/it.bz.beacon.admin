<template>
  <!-- eslint-disable -->
  <div id="navigation" class="col-sm p-0">
    <nav class="row h-100 align-items-start">
      <div class="col-12 p-0">
        <div class="row">
          <div class="beacon-logo shadow-sm col-12 p-0 text-center">
            <img src="../assets/logo.png" class="align-self-center">
          </div>
        </div>
        <router-link class="row navigation-link pl-4" :to="{name: 'home'}">
          <span class="navigation-symbol col"><img></span>
          <span class="pl1 navigation-text col">Beacons</span>
        </router-link>
        <router-link class="row navigation-link pl-4" :to="{name: 'home'}">
          <span class="navigation-symbol col"><img></span>
          <span class="pl1 navigation-text col">Issues</span>
        </router-link>
        <router-link class="row navigation-link highlight pl-4" :to="{name: 'users'}">
          <span class="navigation-symbol col"><img src="../assets/user.png"></span>
          <span class="pl1 navigation-text col">User</span>
        </router-link>
        <router-link class="row navigation-link pl-4" :to="{name: 'home'}">
          <span class="navigation-symbol col"><img></span>
          <span class="pl1 navigation-text col">Settings</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.beacon-logo {
  background-color: #ffffff;
  height: 70px;
  img {
    height: 45px;
    margin-top: 13px;
  }
}

.navigation-symbol {
  max-width: 50px;
  height: 50px;
  padding: 0 10px;
  img {
    height: 30px;
    width: 30px;
  }
}
</style>
