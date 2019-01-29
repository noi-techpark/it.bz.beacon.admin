<template>
  <!-- eslint-disable -->
  <div class="simple-table">
    <transition name="fade">
      <div class="simple-table-loading" v-if="loading">
        <!--<icon-base><icon-loading /></icon-base>-->
      </div>
    </transition>
    <pagination :records-number="mRecords" :offset="offset" :total-records="meta.totalRecords"
                @page-changed="setPage" @records-number-changed="setRecordsNumber" v-if="meta.pagination" />
    <div :class="{'table-responsive': responsive}" v-if="data.length">
      <table class="table table-bordered-outside">
        <thead class="thead-secondary">
        <tr v-if="groupCols.length">
          <th v-if="hasSlot('nested')"></th>
          <th class="group-first-col" v-for="(groupCol, index) in groupCols" :key="index" :colspan="groupCol.colspan || 1">
            {{ groupCol.title || '' }}
          </th>
        </tr>
        </thead>
        <thead :class="{'thead-light thead-sub': groupCols.length, 'thead-secondary': !groupCols.length}">
        <tr>
          <th class="col-nested-btn" v-if="hasSlot('nested')"></th>
          <th v-for="(col, index) in cols" :key="index" @click="changeSorting(col)"
              :class="{
                'sortable': meta.sorting && col.sorting !== false,
                'sortable-active': meta.sorting && meta.sorting.col === col.key,
                'text-right': getColAlign(col) === ALIGN_RIGHT,
                'group-first-col': isGroupFirstCol(index)
              }">
            {{ col.title || '' }}
            <span class="col-sort" v-if="meta.sorting && col.sorting !== false">
                <!--<icon-base width="6" height="7" v-if="meta.sorting.col === col.key">-->
                  <!--<icon-small-arrow-down v-if="meta.sorting.order === 'desc'" />-->
                  <!--<icon-small-arrow-up v-else />-->
                <!--</icon-base>-->
              </span>
          </th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(record, index) in data">
          <tr :key="index + '_1'">
            <td v-if="hasSlot('nested')">
              <button class="btn btn-icon has-nested" :class="{'opened-nested': openedNested[index] === true}"
                      @click="toggleNested(index)">
                <!--<icon-base width="16" height="16"><icon-arrow-down /></icon-base>-->
              </button>
            </td>
            <td v-for="(col, index) in cols" :key="index"
                :class="{
                  'text-right': getColAlign(col) === ALIGN_RIGHT,
                  'group-first-col': isGroupFirstCol(index)
                }">
              <slot :name="'col-' + col.key" :record="record">
                <template v-if="col.type === 'float'">
                    <span class="text-nowrap" :class="{'number-negative': get(record, col.key) < 0}">
                      {{ get(record, col.key) }}
                    </span>
                </template>
                <template v-else-if="col.type === 'euro'">
                    <span class="text-nowrap" :class="{'number-negative': get(record, col.key) < 0}">
                      {{ get(record, col.key) }}
                    </span>
                </template>
                <template v-else-if="col.type === 'date'">
                  <span class="text-nowrap">{{ get(record, col.key) }}</span>
                </template>
                <template v-else-if="col.type === 'month'">
                  {{ get(record, col.key) }}
                </template>
                <template v-else>
                  {{ get(record, col.key) }}
                </template>
              </slot>
            </td>
          </tr>
          <tr v-if="hasSlot('nested') && openedNested[index]" :key="index + '_2'">
            <td :colspan="cols.length + 1" class="border-top-0">
              <slot name="nested" :record="record" />
            </td>
          </tr>
        </template>
        </tbody>
        <tfoot v-if="hasSlot('footer')">
        <slot name="footer" />
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
const ALIGN_RIGHT = 1

import merge from 'lodash/merge'
import get from 'lodash/get'
import Pagination from './Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      openedNested: {},
      ALIGN_RIGHT: ALIGN_RIGHT
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    cols: {
      type: Array,
      default: () => []
    },
    groupCols: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    meta: {
      type: Object,
      default: () => {
        return {}
      }
    },
    responsive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    mRecords() {
      return this.meta.pagination ? this.meta.pagination.records : null
    },
    offset() {
      return ((this.meta.pagination.page - 1) * this.meta.pagination.records) + 1
    },
    hasSlot() {
      return (name = 'default') => !!this.$slots[name] || !!this.$scopedSlots[name]
    },
    groupFirstCols() {
      return this.groupCols.reduce((filtered, group) => {
        filtered.push(group.colspan + (filtered.length ? filtered[filtered.length - 1] : 0))
        return filtered
      }, [])
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.openedNested = {}
      }
    }
  },
  methods: {
    setPage(page) {
      this.emitChange({
        pagination: {
          page: page + 1
        }
      })
    },
    setRecordsNumber(number) {
      this.emitChange({
        pagination: {
          records: number
        }
      })
    },
    changeSorting(col) {
      if (this.meta.sorting && col.sorting !== false) {
        this.emitChange({
          sorting: {
            col: col.key,
            order: this.meta.sorting.col === col.key && this.meta.sorting.order === 'asc' ? 'desc' : 'asc'
          }
        })
      }
    },
    emitChange(dataChanges = {}) {
      this.$emit('change', merge(
        {},
        {
          pagination: this.meta.pagination,
          sorting: this.meta.sorting
        },
        dataChanges
      ))
    },
    toggleNested(index) {
      this.$set(this.openedNested, index, !this.openedNested[index])
    },
    getColAlign(col) {
      return col.type === 'float' || col.type === 'euro' ? ALIGN_RIGHT : 0
    },
    isGroupFirstCol(colIndex) {
      return this.groupCols.length && this.groupFirstCols.indexOf(colIndex) > -1
    },
    get: get
  }
}
</script>

<style lang="scss">

  .simple-table {
    position: relative;
    min-height: 30px; // for loader

    .simple-table-loading {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      background-color: #fff;
      opacity: 0.3;
    }

    .group-first-col {
      border-left: 1px solid #fff;
    }
    .thead-light {
      .group-first-col {
        border-left-color: #fff;
      }
      .sortable svg {
        fill: #000;
      }
    }

    .col-nested-btn {
      width: 1px;
    }

    .has-nested {
      svg {
        transition: transform 0.5s ease;
      }
      &.opened-nested svg {
        transform: rotate(180deg)
      }
    }

    th {
      position: relative;

      &.sortable {
        cursor: pointer;

        &-active {
          padding-right: 22px;
        }

        .col-sort {
          position: absolute;
          right: 10px;
          top: 10px;
          margin-left: 5px;

          .icon-element {
            fill: #fff;
          }
        }
      }
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
  }
</style>