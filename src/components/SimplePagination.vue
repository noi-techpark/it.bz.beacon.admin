<template>
  <nav v-if="pageCount > 1">
    <ul class="pagination pagination-lg">
      <li class="page-item" v-for="(page, index) in getPaginationElements" :key="index">
        <a v-if="page !== null && page !== currentPage"
           href class="page-link d-flex justify-content-center align-items-center"
           @click.prevent="setPage(page)" tabindex="-1">
          {{ page === null ? '...' : page + 1 }}
        </a>
        <span v-else class="d-flex justify-content-center align-items-center"
              :class="'page-link' + (page === currentPage ? ' active' : '')" tabindex="-1">
                  {{ page === null ? '...' : page + 1 }}
                </span>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    pageCount: 0,
    currentPage: 0
  },
  computed: {
    getPaginationElements() {
      let items = [],
        pc = this.pageCount,
        cp = this.currentPage

      if (pc <= 7) {
        return Array.from(Array(pc).keys())
      }

      const conditionStart = () => cp <= 3
      const conditionMiddle = () => cp > 3 && cp < pc - 4
      const conditionEnd = () => cp >= pc - 4

      for (let i = 0; i < pc; i++) {
        // skipping elements conditions
        if (conditionStart() && (i > 4 && i < pc - 1)) {
          continue
        }

        if (conditionMiddle() && (i !== 0 && (i < cp - 1 || i > cp + 1) && i !== pc - 1)) {
          continue
        }

        if (conditionEnd() && (i !== 0 && (i < cp - 4 || i < pc - 5))) {
          continue
        }

        // adding elements conditions
        if ((conditionMiddle() || conditionStart()) && i === pc - 1) {
          items.push(null)
        }

        items.push(i)

        if ((conditionMiddle() || conditionEnd()) && i === 0) {
          items.push(null)
        }
      }

      return items
    }
  },
  methods: {
    setPage(number) {
      this.$emit('page-changed', number)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~bootstrap/scss/functions';
  @import '~bootstrap/scss/variables';

  $secondary: #9ba02b;

  .pagination-lg {
    .page-item {
      .page-link {
        padding: 0;
        font-size: 15px;
        box-sizing: border-box;
        width: 45px;
        height: $input-height;

        &:focus {
          box-shadow: none;
        }
      }

      a.page-link {
        color: $secondary;
      }

      span.page-link {
        color: #aaa;
        pointer-events: none;

        &.active {
          background-color: $secondary;
          color: #fff;
          border-color: $secondary;
          font-weight: 700;
        }
      }
    }
  }
</style>
