<template>
  <span class="p-0 d-flex align-items-start" ><span :class='"badge badge-pill issue-status-pill" + statusClass'>{{ ticketId? '#' + ticketId: 'No Ticket-Id' }}</span></span>
</template>

<script>
  export default {
    props: {
      ticketId: {
        type: Number
      },
      styleBig: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      statusClass() {
        let statusClass = ''
        if(this.styleBig)
          statusClass += ' big'
        return statusClass;
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../variables";

  .issue-status-pill {
    color: white;
    display:block;
    line-height: 1rem;
    font-weight: normal;
    font-size: 0.66rem;
    background-color: $light-blue;

    &.big {
      font-size: 1rem;
      padding: 0.5rem 1rem;
    }
  }
</style>
