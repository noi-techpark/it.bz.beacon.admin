<template>
  <!-- eslint-disable -->
  <div class="simple-table">
    <transition name="fade">
      <div class="simple-table-loading" v-if="loading">
        <!--<icon-base><icon-loading /></icon-base>-->
      </div>
    </transition>
    <pagination class="mb-2"
                :records-number="mRecords" :records-number-list="meta.pagination.recordsNumberList" :records-number-list-enabled="true" :offset="offset" :total-records="meta.totalRecords"
                @page-changed="setPage" @records-number-changed="setRecordsNumber" v-if="meta.pagination" />
    <div :class="{'table-responsive': responsive}" v-if="data.length">
      <table class="table table-bordered-outside">
        <thead class="thead-secondary table-header">
        <tr v-if="groupCols.length">
          <th v-if="hasSlot('nested')"></th>
          <th class="group-first-col" v-for="(groupCol, index) in groupCols" :key="index" :colspan="groupCol.colspan || 1">
            {{ groupCol.title || '' }}
          </th>
        </tr>
        </thead>
        <thead class="table-header " :class="{'thead-light thead-sub': groupCols.length, 'thead-secondary': !groupCols.length}">
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
          <tr :key="index + '_1'" class="table-item" @click="rowClick(record)">
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
                <template v-else-if="col.type === 'delete-button'">
                  <button type="button" class="btn btn-delete" title="Delete user" @click.prevent.stop="rowDeleteClick(record)" v-if="get(record, col.identifier) !== getUsername"></button>
                </template>
                <template v-else-if="col.type === 'modify-buttons'">
                  <button type="button" :title="'Change ' + col.name" class="btn btn-edit" @click.prevent.stop="rowChangeClick(record)"></button>
                  <button type="button" :title="'Delete ' + col.name" class="btn btn-delete" @click.prevent.stop="rowDeleteClick(record)"></button>
                </template>
                <template v-else-if="col.type === 'beacon-status'">
                  <beacon-status :status="get(record, col.key)"/>
                </template>
                <template v-else-if="col.type === 'battery-level'">
                  <battery-level :level="get(record, col.key)"/>
                </template>
                <template v-else-if="col.type === 'euro'">
                    <span class="text-nowrap" :class="{'number-negative': get(record, col.key) < 0}">
                      {{ get(record, col.key) }}
                    </span>
                </template>
                <template v-else-if="col.type === 'date'">
                  <span class="text-nowrap">{{ get(record, col.key) | formatDate }} </span>
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
    <pagination class="mt-2"
                :records-number="mRecords" :records-number-list="meta.pagination.recordsNumberList" :records-number-list-enabled="false" :offset="offset" :total-records="meta.totalRecords"
                @page-changed="setPage" @records-number-changed="setRecordsNumber" v-if="meta.pagination" />
  </div>
</template>

<script>
  const ALIGN_RIGHT = 1

  import merge from 'lodash/merge'
  import get from 'lodash/get'
  import Pagination from './Pagination'
  import BeaconStatus from './BeaconStatus'
  import BatteryLevel from './BatteryLevel'
  import moment from 'moment'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      Pagination,
      BeaconStatus,
      BatteryLevel
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
      ...mapGetters('login', [
        'getUsername'
      ]),
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
      rowClick(record) {
        this.$emit('rowClicked', record)
      },
      rowDeleteClick(record) {
        this.$emit('rowDeleteClicked', record)
      },
      rowChangeClick(record) {
        this.$emit('rowChangeClicked', record)
      },
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
    },
    filters: {
      formatDate: (dateString) => {
        let date = moment(dateString)
        if (!date.isValid()) {
          return ''
        }

        return date.format('DD.MM.YYYY')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../variables';

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

  .btn-delete {
    mask-image: url("../assets/delete.svg");
    background-color: black;
    height: 1.3rem;

    &:hover {
      background-color: red;
    }
  }
  .btn-edit {
    mask-image: url("./../assets/ic_edit.svg");
    background-color: black;
    height: 1.3rem;

    &:hover {
      background-color: red;
    }
  }
</style>
