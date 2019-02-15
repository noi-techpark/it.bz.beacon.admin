<template>
  <nav>
    <ul class="pagination pagination-lg mb-0">
      <li class="page-item zipfl">
        <a
           href class="page-link d-flex justify-content-center align-items-center page-link-iconed " :class="currentPage <= 0 ? 'page-link-disabled' : ''"
           @click.prevent="setPage(currentPage - 1)" tabindex="-1">
          <img src="../assets/img/action_previous.svg" class="page-link-icon"/>
        </a>
      </li>
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
      <li class="page-item">
        <a
          href class="page-link d-flex justify-content-center align-items-center page-link-iconed " :class="currentPage >= pageCount - 1 ? 'page-link-disabled' : ''"
          @click.prevent="setPage(currentPage + 1)" tabindex="-1">
          <img src="../assets/img/action_next.svg" class="page-link-icon"/>
        </a>
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
      if (number >= 0 && number < this.pageCount) {
        this.$emit('page-changed', number)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~bootstrap/scss/functions';
  @import '~bootstrap/scss/variables';
  @import '../variables';

  .pagination-lg {
    .page-item {

      .page-link {
        padding: 0.5em 1em;
        font-size: 1em;
        box-sizing: border-box;
        line-height: 2rem;
        height: 2rem;

        &:focus {
          box-shadow: none;
        }
      }

      a.page-link {
        color: $text-grey;

        &.page-link-iconed {
          padding: 0.25em;
        }

        .page-link-icon {
          opacity: 0.6;
        }

        &.page-link-disabled {
          color: $text-muted-grey;
          cursor: not-allowed;
          background: $background-grey;

          img {
            opacity: 0.3;
          }
        }
      }

      span.page-link {
        color: #aaa;
        pointer-events: none;

        &.active {
          background-color: $light-blue;
          color: #fff;
          border-color: $light-blue;
          font-weight: 700;
        }
      }
    }
  }
</style>
