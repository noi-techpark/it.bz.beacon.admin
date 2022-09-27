<template>
  <div class="" style="position: relative">
    <div class="row issue-comment-container pt-2 pb-2">
        <div class="row col-12">
          <div class="col-12 d-flex">
            <b>{{issueComment.userName}}</b>
            <span class="ml-2"> @{{issueComment.userUsername}}</span>
            <span class="ml-2 mr-2">·</span>
            <span>{{issueComment.createDate | formatTimestamp}}</span>
            <span class="ml-2" v-if="issueComment.updateDate">
              <span> (edited </span>
              <span class="d-inline-block">
                <span >{{issueComment.updateDate | formatTimestamp}}</span>
              </span>
              <span>)</span>
            </span>
            <div class="flex-grow-1"></div>
            <button type="button" :title="'Modify comment'" class="btn btn-edit" @click="modifyComment" v-if="!editing"></button>
            <button type="button" :title="'Delete comment'" class="btn btn-delete" @click="deleteComment"></button>
          </div>
        </div>
        <div class="row col-12 mt-1">
          <div class="col-12" v-if="!editing">
            <p class="issue-comment-content">{{issueComment.comment}}</p>
          </div>

          <div class="col-12" v-if="editing">
            <div class="row col-12">
                <textarea class="form-control form-issue-comment-control" v-model="newComment.comment" placeholder="Write a short comment"></textarea>
                <small class="form-issue-comment-label">Comment</small>
            </div>
            <div class="col-12 d-flex justify-content-end mb-2" style="gap: 0.5rem">
              <button class="btn btn-edit-comment btn-outline-secondary pl-3 pr-3" @click="cancelComment()">
                <span class="btn-title">Cancel</span>
                <div class="spinner" v-show="saving"></div>
              </button>
              <button class="btn btn-edit-comment btn-save-comment pl-3 pr-3" :disabled="newComment.comment == '' || newComment.comment == issueComment.comment || saving" @click="saveComment()">
                <span class="btn-title">Save comment</span>
                <div class="spinner" v-show="saving"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    <loader :visible="saving" :label="savingLabel"/>
    <confirm ref="deleteGroupConfirm" titleText="Delete comment" confirmText="Delete" cancelText="Cancel">
      Are you sure to you want to delete the comment?<br />
      This cannot be undone.
    </confirm>
  </div>
</template>

<script>
import moment from 'moment'
import { Scrollable } from '../directive/Scrollable'
import {createIssueComment, deleteGroup, deleteIssueComment, updateIssueComment} from "@/service/apiService";
import Loader from "@/components/Loader";
import Confirm from "@/components/Confirm";

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
    },
    issueComments: {
      type: Array,
    },
    issueId: {
      type: Number,
      default: 0
    }
  },
  components: {
    Loader,
    Confirm,
  },
  directives: {
    Scrollable
  },
  data() {
    return {
      promise: null,
      error: true,
      saving: false,
      errorMessage: "Unable to save the comment. Please retry.",
      newComment: {
        comment: ''
      },
      editing: false,
      savingLabel: '',
    }
  },
  mounted() {
  },
  methods: {
    close(resolved) {
      if (this.promise) {
        if (resolved) {
          this.promise.resolve()
        } else {
          this.promise.reject()
        }
      }
      this.promise = null
    },
    modifyComment() {
      this.editing = true;
      this.newComment.comment = this.issueComment.comment;
    },
    cancelComment() {
      this.editing = false;
      this.newComment.comment = '';
    },
    saveComment() {
      this.error = false
      this.saving = true
      this.savingLabel = 'Saving issue comment...'
      updateIssueComment(this.issueId, this.issueComment.id, {comment: this.newComment.comment})
        .then((updatedComment) => {
          this.$set(this, 'saving', false)
          this.$set(this, 'editing', false)
          this.$set(this, 'issueComment', updatedComment)
        })
        .catch(() => {
          this.$set(this, 'saving', false)
          this.$set(this, 'error', true)
        })
    },
    deleteComment() {
      this.$refs.deleteGroupConfirm.open()
        .then(() => {
          this.error = false
          this.saving = true
          this.savingLabel = 'Deleting issue comment...'
          deleteIssueComment(this.issueId, this.issueComment.id)
            .then(() => {
              this.$set(this, 'saving', false)
              this.$set(this, 'editing', false)
              this.$emit('deleteComment')
            })
            .catch(() => {
              this.$set(this, 'saving', false)
              this.$set(this, 'error', true)
            })
        })
        .catch(() => {})

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


  .issue-comment-container {
    color: $text-grey;
    font-size: 0.9rem;

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

  textarea.form-issue-comment-control {
    resize: none;
    height: 6em;
    border: 1px solid $grey;
    font-size: 0.9rem;

    &:focus {
      border: 1px solid $light-blue;
    }
  }

  .form-issue-comment-label {
    opacity: 0.5;
    font-size: 0.8rem;

    &.form-issue-comment-label-readonly {
      opacity: 0.3;
    }
  }

  .btn {
    font-size: 0.9em;

    &.btn-edit-comment {
      padding: 0.1em 0.5em;

      &.btn-save-comment {
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

  .issue-comment-content {
    white-space: pre-wrap;
    border: 1px solid #A4AFB7;
    padding: 0.375rem 0.75rem;
    border-radius: 0.25rem;
    font-weight: 400;
    line-height: 1.5;
    background-color: rgba(233, 236, 239, 0.3)
  }

  .btn-delete {
    mask-image: url("../assets/delete.svg");
    background-color: black;
    height: 1.3rem;

    &:hover {
      background-color: $lighter-blue;
    }
  }
  .btn-edit {
    mask-image: url("./../assets/ic_edit.svg");
    background-color: black;
    height: 1.3rem;

    &:hover {
      background-color: $lighter-blue;
    }
  }

</style>
