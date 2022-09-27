<template>
  <div class="row issue-comment-container pt-4 pb-4">
    <div class="row col-12">
      <div class="col-12">
        <b>{{issueComment.userName}}</b>
        <span> @{{issueComment.userUsername}}</span>
        <span> · </span>
        <span>{{issueComment.createDate | formatTimestamp}}</span>
        <span v-if="issueComment.updateDate">
          <span> (updated </span>
          <span class="d-inline-block">
            <span >{{issueComment.updateDate | formatTimestamp}}</span>
          </span>
          <span>)</span>
        </span>
      </div>
    </div>
    <div class="row col-12">
      <div class="col-12"><p class="issue-comment-content">{{issueComment.comment}}</p></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { Scrollable } from '../directive/Scrollable'

export default {
  props: {
    issueComment: {
      type: Object,
      default: {
        id: '',
        userUsername: "",
        userName: '',
        comment: '',
        issueId: '',
        createDate: '',
        updateDate: ''
      }
    }
  },
  directives: {
    Scrollable
  },
  data() {
    return {
      visible: false,
      promise: null,
      error: true,
      saving: false,
      errorMessage: "Unable to save the comment. Please retry.",
    }
  },
  methods: {
    open(issue) {
      this.visible = true
      this.issue = issue
      return new Promise((resolve, reject) => {
        this.promise = {
          resolve: resolve,
          reject: reject
        }
      })
    },
    close(resolved) {
      this.visible = false
      if (this.promise) {
        if (resolved) {
          this.promise.resolve()
        } else {
          this.promise.reject()
        }
      }
      this.promise = null
    }
  },
  filters: {
    formatDate: (dateString) => {
      let date = moment(dateString)
      if (!date.isValid()) {
        return ''
      }

      return date.format('DD.MM.YYYY')
    },
    formatTimestamp: (dateString) => {
      let date = moment(dateString)
      if (!date.isValid()) {
        return ''
      }

      return date.format('DD.MM.YYYY HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>

  @import '../variables';

  .image-modal-actions {
    .btn {
      padding: 0.1em 0.5em;
      font-size: 0.9em;

      &.btn-outline-secondary {
        border-color: $grey;

        &:hover {
          background: $grey;
        }
      }
    }
  }

  .form-issue-control {
    border: 1px solid $dark-blue;
    font-size: 0.8rem;
    color: $text-grey;

    &[readonly] {
      color: white;
      background: transparent;
    }

    &:focus {
      outline: 0;
      box-shadow: none;
      border: 1px solid $dark-blue;
      color: white;

      &:not([readonly]) {
        color: $text-grey;
        border: 1px solid $light-blue;
      }
    }
  }

  .form-issue-solution-control {
    color: $text-grey;
    border: 1px solid $grey;
    font-size: 0.8rem;

    &[readonly] {
      opacity: 0.3;
    }

    &:focus {
      outline: 0;
      box-shadow: none;
      border: 1px solid $grey;
    }

    &::placeholder {
      opacity: 0.5;
    }
  }

  textarea.form-issue-control {
    resize: none;
    height: 6em;
  }

  textarea.form-issue-solution-control {
    resize: none;
    height: 6em;
    border: 1px solid $grey;

    &:focus {
      border: 1px solid $light-blue;
    }
  }

  .form-issue-label {
    opacity: 0.5;
    font-size: 0.8rem;
  }

  .form-issue-solution-label {
    opacity: 0.5;
    font-size: 0.8rem;

    &.form-issue-solution-label-readonly {
      opacity: 0.3;
    }
  }

  .btn {

    &.btn-issue-resolve {
      color: white;
      background: $light-blue;
      border: 1px solid $light-blue;

      &:hover {
        background: $lighter-blue;
      }

      &:focus {
        outline: 0;
        box-shadow: none;
      }
    }
  }

  .alert-danger {
    font-size: 0.8rem;
  }

  .btn-close {
    color: white;
    position: absolute;
    top: 0.5rem;
    right: 0;

    &:focus {
      outline: 0;
      box-shadow: none;
    }
  }

  .issue-comment-container {
    border-bottom: 1px solid $background-grey;
  }

  .issue-comment-content {
    white-space: pre-wrap;
  }

</style>
