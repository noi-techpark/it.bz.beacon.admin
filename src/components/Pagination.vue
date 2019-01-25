<template>
  <!-- eslint-disable -->
  <div class="form-row justify-content-between">
    <div class="col-12 col-md-3 col-lg-auto align-self-center">
      <template v-if="offset && (offset > 1 || offsetEnd < totalRecords)">
        {{ 'Records' | capitalize }} {{ 'From' }}
        <span class="pagination-highlight">{{ offset }} {{ 'To' }} {{ offsetEnd }}</span>
        {{ 'Of' }} <span class="pagination-highlight">{{ totalRecords }}</span>
      </template>
      <template v-else>
        <span class="pagination-highlight">{{ totalRecords }}</span> Total records
      </template>
    </div>
    <div class="col-12 col-sm-10 col-md-5 d-flex justify-content-md-center col-lg-auto">
      <div class="form-group mb-0">
        <label style="visibility: hidden">_</label>
        <simple-pagination v-if="offset" :page-count="pageCount" :current-page="currentPage"
                           @page-changed="pageChanged"/>
      </div>
    </div>
    <div class="col-12 col-sm-2 col-md-3 col-lg-2 col-xl-1">
      <div class="form-group">
        <label>Show</label>
        <select class="form-control" v-model="mRecordsNumber">
          <option v-for="number in mRecordsNumberList" :key="number" :value="number">{{ number }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import SimplePagination from './SimplePagination'

export default {
  components: {
    SimplePagination
  },
  props: {
    totalRecords: Number,
    offset: Number,
    recordsNumber: Number,
    recordsNumberList: Array
  },
  data() {
    return {
      mRecordsNumber: this.recordsNumber
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalRecords / this.recordsNumber)
    },
    currentPage() {
      return Math.floor(this.offset / this.recordsNumber)
    },
    offsetEnd() {
      return Math.min(this.recordsNumber * (this.currentPage + 1), this.totalRecords)
    },
    mRecordsNumberList() {
      let list = this.recordsNumberList || [10, 20, 30, 50]
      if (list.indexOf(this.recordsNumber) === -1) {
        list.push(this.recordsNumber)
        list.sort((a, b) => a - b)
      }
      return list
    }
  },
  watch: {
    mRecordsNumber(number) {
      this.$emit('records-number-changed', number)
    }
  },
  methods: {
    pageChanged(page) {
      this.$emit('page-changed', page)
    }
  },
  filters: {
    capitalize(value) {
      if (!value) {
        return ''
      }
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
</script>

<style lang="scss">

</style>
