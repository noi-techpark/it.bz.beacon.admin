<template>
  <div class="dropdown">
    <img class="search-icon mt-0" :src="require('../assets/ic_groups_gray.svg')">
    <input type="text" class="beacon-search" v-model="search" placeholder="Group"
           @focus="inputFieldFocused = true"
           @blur="inputFieldFocused = false"
           v-on:keydown.up.prevent="changeActiveGroup(-1)" v-on:keydown.down.prevent="changeActiveGroup(1)"
           v-on:keydown.enter.prevent="selectActiveGroup()">
    <div v-if="searchGroupDropdownVisible"
         class="dropdown-menu" aria-labelledby="dropdownMenuButton"
         @mouseover="dropdownHover = true" @mouseleave="dropdownHover = false">
      <a class="dropdown-item" v-bind:key="group.id" v-on:click.stop.prevent="selectGroup(group)"
         v-for="(group, groupIndex) in searchedGroups"
         v-bind:class="{ active: groupIndex == activeGroup}">
        {{ group.name }}
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('groups', [
      'groups'
    ]),
    searchGroupDropdownFocused() {
      return (this.inputFieldFocused || this.dropdownHover);
    },
    searchGroupDropdownVisible() {
      return (this.inputFieldFocused || this.dropdownHover) &&
        this.searchedGroups.length > 0 && !this.groupSelected;
    },
    groupFilter: {
      get: function () {
        return this.parentGroupFilter
      },
      set: function(value){
        this.$emit('parentGroupFilterChange', value)
      }
    }
  },
  props: ['parentGroupFilter'],
  model: {
    prop: 'parentGroupFilter',
    event: 'parentGroupFilterChange'
  },
  data() {
    return {
      search: '',
      groupSelected: false,
      inputFieldFocused: false,
      activeGroup: 0,
      dropdownHover: false,
      searchedGroups: []
    }
  },
  watch: {
    groups() {
      this.setupDropDown()
    },
    search() {
      this.setupDropDown()
      this.groupSelected = this.searchedGroups !== null && this.searchedGroups.some((group) => group.name === this.search)
      if (this.groupSelected && this.search !== this.groupFilter) {
        this.groupFilter = this.search;
      }
      if (this.search === '' && this.groupFilter !== '') {
        this.groupFilter = '';
      }
    },
    searchGroupDropdownFocused() {
      if(!this.searchGroupDropdownFocused) {
        this.search = this.groupFilter
      }
    },
    searchGroupDropdownVisible() {
      if(!this.searchGroupDropdownVisible) {
        this.dropdownHover = false;
      }
    },
    parentGroupFilter() {
      this.search = this.parentGroupFilter
    }
  },
  methods: {
    setupDropDown() {
      this.activeGroup = null
      if (this.groups === null || this.search === null || this.search === '') {
        this.searchedGroups = []
      } else {

        this.searchedGroups = this.groups.slice(0).filter((group) => {
          return typeof group !== 'undefined'
        }).filter((group) => {
          return group.name.toLowerCase().includes(this.search.toLowerCase())
        })
      }
    },
    changeActiveGroup(change) {
      if(this.searchedGroups.length > 0) {
        if (this.activeGroup === null) {
          this.activeGroup = change === 1? 0: this.searchedGroups.length - 1
        } else {
          if(change === 1)
            if(this.activeGroup + 1 < this.searchedGroups.length)
              this.activeGroup += 1
            else
              this.activeGroup = 0
          if(change === -1)
            if(this.activeGroup > 0)
              this.activeGroup -= 1
            else
              this.activeGroup = this.searchedGroups.length - 1
        }
      }
    },
    selectActiveGroup() {
      if(this.activeGroup !== null)
        this.selectUser(this.searchedGroups[this.activeGroup])
    },
    selectGroup(group) {
      this.search = group.name
    }
  }
}
</script>

<style lang="scss" scoped>

  @import '../variables';

  .beacon-search {
    height: 100%;
    width: 100%;
    color: #666666;
    border: none;
    padding-left: 50px;
  }

  .search-icon {
    top: 0px;
    left: 10px;
    position: absolute;
    height: 30px;
    width: 30px;
    opacity: 0.3;
  }

  .dropdown-item.active {
    background-color: $light-blue;
  }

  .dropdown-item:active {
    background-color: $light-blue;
  }

  .dropdown-menu {
    display: block;
    left: 25px;
  }

</style>
