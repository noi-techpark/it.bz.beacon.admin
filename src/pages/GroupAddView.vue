<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="body">
      <div class="container p-0" v-if="isAdmin" v-show="!saving">
        <div class="row group-display m-4 p-4">
          <div class="col-12 p-0">
            <form @submit.prevent="create">
              <div class="form-group row">
                <label for="name" class="col-sm-2 pl-0 col-form-label">Name</label>
                <div class="col-sm-10 pr-0">
                  <input type="text" required class="form-control" id="name" v-model="group.name" placeholder="Name">
                </div>
              </div>
              <div class="row">
                <div class="col-12 pl-0 pr-0">
                  <div class="alert alert-danger" role="alert" v-if="error">
                    Unable to create new group. Please verify that the group does not already exist and the password corresponds to the password rules.
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 pl-0 pr-0">
                  <div class="d-flex flex-row-reverse">
                    <button class="btn btn-primary" type='submit'>Create</button>
                    <router-link :to="{name: 'groups'}" class="btn btn-secondary mr-3">Cancel</router-link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <loader :visible="saving" :label="'Creating group...'"/>
      </div>
    </template>
  </layout>
</template>

<script>
  import Layout from '../components/Layout'
  import Loader from '../components/Loader'
  import router from '../router/index'
  import { createGroup } from '../service/apiService'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      Layout,
      Loader
    },
    name: 'AddGroup',
    data() {
      return {
        title: 'AddGroup',
        group: {
          name: ''
        },
        saving: false,
        error: false
      }
    },
    computed: {
      ...mapGetters('login', [
        'isAdmin'
      ])
    },
    methods: {
      create() {
        this.saving = true
        this.error = false
        createGroup(this.group)
                .then(() => {
                  router.push({name: 'groups'})
                  this.saving = false
                })
                .catch(() => {
                  this.saving = false
                  this.error = true
                })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  div.form-group {
    margin-bottom: 1rem;
  }

  input {
    font-size: 1em;
  }

  .btn {
    font-size: 1em;
  }
</style>
