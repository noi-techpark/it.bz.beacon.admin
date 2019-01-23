<template>
  <!-- eslint-disable -->
  <home :source="title">
    <template slot="body">
      <div class="row headline p-4">
        <div class="col">
          <router-link :to="{name: 'users'}" class="back-link">&laquo; back</router-link>
        </div>
      </div>
      <div class="row user-display m-4 p-4">
        <div class="col-12 mb-4 col-header">
          <div class="row">
            <div class="col-1">Id</div>
            <div class="col-2">Username</div>
            <div class="col-2">Firstname</div>
            <div class="col-2">Surname</div>
            <div class="col-5">Email</div>
          </div>
        </div>
        <div class="col-12 mb-4 col-header" v-show="getUser">
          <div class="row">
            <div class="col-1">{{ getUser.id }}</div>
            <div class="col-2">{{ getUser.username }}</div>
            <div class="col-2">{{ getUser.name }}</div>
            <div class="col-2">{{ getUser.lastname }}</div>
            <div class="col-5">{{ getUser.email }}</div>
          </div>
        </div>
      </div>
    </template>
  </home>
</template>

<script>
import Home from './Home'
import { mapGetters } from 'vuex'

export default {
  components: {
    Home
  },
  name: 'User',
  data() {
    return {
      title: 'User'
    }
  },
  computed: {
    ...mapGetters('users', [
      'getUsers'
    ]),
    getUser() {
      let userId = this.$route.params.id,
        returnUser = false
      this.getUsers.forEach(function(user) {
        if (parseInt(user.id) === parseInt(userId)) {
          returnUser = user
        }
      })
      return returnUser
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
