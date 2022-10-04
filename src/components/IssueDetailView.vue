<template>
  <!-- eslint-disable -->
  <div class="row row-eq-height" style="position: relative" v-if="visible">
    <div class="col-md-12 col-lg-12 col-xl-12 d-flex mt-4 " :visible="loaded">
      <div class="row issue-detail-card">
        <div class="col-12 p-0 d-flex flex-column justify-content-between">
          <div class="row">
            <div class="issue-header pt-3 pb-3 pr-4 pl-4">
              <div class="row">
                <div class="col-xs-12 col-md-auto p-0">
                  <issue-status :styleBig="true" :resolved="issue.resolved" />
                </div>
                <div class="col-xs-12 col-md d-flex flex-column p-0 pr-md-3">
                  <div class="row">
                    <span class="ml-2">Issue created {{ issue.reportDate | formatTimeAgo }} by <b>{{ issue.reporter }}</b></span>
                  </div>
                  <div class="row" v-if="issue.resolved">
                    <span class="ml-2">Issue closed {{ issue.resolveDate | formatTimeAgo }} by <b>{{ issue.resolver }}</b></span>
                  </div>
                </div>
                <button type="button" class="btn btn-close" @click="close()"><img src="../assets/ic_close.svg"/></button>
              </div>
              <div class="row mt-4" v-if="editing">
                <div class="col-12 p-0">
                    <input type="text" class="form-control" v-model="issueUpdate.ticketId" :readonly="!editing" />
                    <small class="">Ticket-Id</small>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-12 p-0">
                  <div class="col-12 row p-0">
                    <div class="col-xs-12 col-lg p-0 order-lg-2">
                      <issue-ticket-id :styleBig="true" :ticket-id="issue.ticketId" v-if="issue.ticketId" />
                    </div>
                    <h2 class="col-xs-12 col-lg-auto p-0 mr-2 order-lg-1" v-if="!editing">{{ issue.problem }}</h2>
                  </div>
                  <div class="col-12 p-0" v-if="editing">
                    <input type="text" class="form-control" v-model="issueUpdate.problem" :readonly="!editing" />
                    <small class="">Problem</small>
                  </div>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-12 p-0" v-if="!editing">
                  <p class="issue-problem-description">{{ issue.problemDescription }}</p>
                </div>
                <div class="col-12 p-0" v-if="editing">
                  <textarea class="form-control form-issue-solution-control" v-model="issueUpdate.problemDescription" placeholder="Write a short comment"></textarea>
                  <small class="">Description</small>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-xs-12 col-sm-6 col-md-8 col-lg-9" v-show="!editing">
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-show="!editing">
                  <select class="form-control" @change="executeAction">
                    <option value="">Action</option>
                    <option value="edit">Edit</option>
                    <option value="delete" v-if="isAdmin">Delete</option>
                  </select>
                </div>
                <div class="col" v-show="editing">
                </div>
                <div class="col-auto edit-actions" v-show="editing">
                  <button class="btn btn-outline-secondary-white mr-4 pl-3 pr-3" @click="cancelEdit">Cancel</button>
                  <button class="btn btn-issue-comment  pl-5 pr-5" @click="save">Save</button>
                </div>
              </div>
            </div>
          </div>

          <issue-comment-item :issueId="issue.id" @deleteComment="deleteComment(issueComment)" :issue-comment="issueComment" v-for="(issueComment, index) in issueComments"></issue-comment-item>

          <div class="issue-comment-separator" v-if="issueComments.length > 0" />

          <div class="row mt-4 mb-4">
            <div class="row mt-2 col-12">
              <div class="col-12">
                <textarea class="form-control form-issue-solution-control" v-model="newComment.comment" placeholder="Write a short comment"></textarea>
                <small class="form-issue-solution-label">Comment</small>
              </div>
            </div>
            <div class="row mt-2 col-12">
              <div class="col-12">
                <div class="alert alert-danger" role="alert" v-if="error">
                  {{errorMessage}}
                </div>
              </div>
              <div class="col-12 d-flex justify-content-end mt-2" style="gap: 0.5rem">
                <button class="btn btn-outline-secondary pl-5 pr-5" v-show="!issue.resolved && newComment.comment == ''" :disabled="saving" @click="closeIssue()">
                  <span class="btn-title">Close</span>
                  <div class="spinner" v-show="saving"></div>
                </button>
                <button class="btn btn-outline-secondary pl-5 pr-5" v-show="!issue.resolved && newComment.comment != ''" :disabled="saving" @click="commentIssue(true)">
                  <span class="btn-title">Close with comment</span>
                  <div class="spinner" v-show="saving"></div>
                </button>
                <button class="btn btn-outline-secondary pl-5 pr-5" v-show="issue.resolved" :disabled="saving" @click="reopenIssue()">
                  <span class="btn-title">Reopen</span>
                  <div class="spinner" v-show="saving"></div>
                </button>
                <button class="btn btn-issue-comment pl-5 pr-5" :disabled="newComment.comment == '' || saving" @click="commentIssue()">
                  <span class="btn-title">Comment</span>
                  <div class="spinner" v-show="saving"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <loader :visible="!loaded" :label="'Loading issue comments ...'"/>
    <loader :visible="saving" :label="savingLabel"/>
    <confirm ref="deleteIssueConfirm" titleText="Delete issue" confirmText="Delete" cancelText="Cancel">
      Are you sure to you want to delete the issue and all its associated comments?<br />
      This cannot be undone.
    </confirm>
  </div>
</template>

<script>
import moment from 'moment'
import { Scrollable } from '../directive/Scrollable'
import IssueStatus from "@/components/IssueStatus";
import IssueCommentItem from "@/components/IssueCommentItem";
import Loader from '../components/Loader'
import {
  createIssueComment, deleteIssue,
  getIssueComments,
  updateIssue,
  updateIssueStatus
} from "@/service/apiService";
import Confirm from "@/components/Confirm";
import IssueTicketId from "@/components/IssueTicketId";
import {mapGetters} from "vuex";

export default {
  components: {
    IssueTicketId,
    IssueCommentItem,
    IssueStatus,
    Loader,
    Confirm,
  },
  directives: {
    Scrollable
  },
  data() {
    return {
      visible: false,
      loaded: false,
      issue: {
        problem: '',
        problemDescription: '',
        reportDate: '',
        reporter: '',
        solution: '',
        solutionDescription: '',
        resolver: '',
        resolved: false,
        ticketId: null
      },
      issueUpdate: {
        problem: '',
        problemDescription: '',
        ticketId: ''
      },
      issueComments: [],
      error: true,
      saving: false,
      editing: false,
      savingLabel: "Saving issue...",
      errorMessage: "Unable to close the issue. Please verify that it has not been resolved yet.",
      newComment: {
        comment: ''
      }
    }
  },
  computed: {
    ...mapGetters('login', [
      'isAdmin'
    ])
  },
  methods: {
    open(issue) {
      this.visible = true
      this.issue = issue
      this.saving = false
      this.error = false
      this.loaded = false
      this.issueComments = []
      this.newComment.comment = ''
      this.loadComments()
    },
    close() {
      this.visible = false
      this.$emit('closeIssueDetails')
    },
    closeIssue() {
      if(this.issueComments.length == 0) {
        this.error = true
        this.errorMessage = "Unable to close the issue. Please write a short comment about the solution."
        return
      }
      this.error = false
      this.saving = true
      this.savingLabel = 'Closing issue...'
      updateIssueStatus(this.issue.id, {resolved: true})
        .then((updatedIssue) => {
          this.$set(this, 'saving', false)
          this.issue = updatedIssue
          this.$emit('issuesUpdate')
        })
        .catch(() => {
          this.$set(this, 'saving', false)
          this.$set(this, 'error', true)
          this.errorMessage = "Unable to close the issue. Please verify the data and retry."
        })
    },
    reopenIssue() {
      this.error = false
      this.saving = true
      this.savingLabel = 'Reopening issue...'
      updateIssueStatus(this.issue.id, {resolved: false})
        .then((updatedIssue) => {
          this.$set(this, 'saving', false)
          this.issue = updatedIssue
          this.$emit('issuesUpdate')
        })
        .catch(() => {
          this.$set(this, 'saving', false)
          this.$set(this, 'error', true)
          this.errorMessage = "Unable to reopen the issue. Please verify the data and retry."
        })
    },
    commentIssue(closeOnComment = false) {
      this.error = false
      this.saving = true
      this.savingLabel = 'Saving issue comment...'
      createIssueComment(this.issue.id, {comment: this.newComment.comment, closeOnComment: closeOnComment})
        .then((newComment) => {
          this.$set(this, 'saving', false)
          this.issueComments.push(newComment)
          this.newComment.comment = ''
          if(closeOnComment) {
            this.issue.resolved = true
            this.$emit('issuesUpdate')
          }
        })
        .catch(() => {
          this.$set(this, 'saving', false)
          this.$set(this, 'error', true)
          this.errorMessage = "Unable to comment the issue. Please verify the data and retry."
        })
    },
    loadComments() {

      getIssueComments(this.issue.id).then(issueComments => {
        this.issueComments = issueComments
        this.loaded = true
      })
    },
    deleteComment(issueComment) {
      this.issueComments = this.issueComments.filter(ic => ic.id != issueComment.id)
    },
    cancelEdit() {
      this.editing = false
    },
    save() {
      this.error = false
      this.saving = true
      this.savingLabel = 'Updating issue...'
      updateIssue(this.issue.id, this.issueUpdate)
        .then((updatedIssue) => {
          this.$set(this, 'editing', false)
          this.$set(this, 'saving', false)
          this.issue = updatedIssue
          this.$emit('issuesUpdate')
        })
        .catch(() => {
          this.$set(this, 'saving', false)
          this.$set(this, 'error', true)
          this.errorMessage = "Unable to update the issue. Please verify the data and retry."
        })
    },
    delete() {
      this.$refs.deleteIssueConfirm.open()
        .then(() => {
          this.error = false
          this.saving = true
          this.savingLabel = 'Deleting issue ...'
          deleteIssue(this.issue.id)
            .then(() => {
              this.$set(this, 'saving', false)
              this.$set(this, 'editing', false)
              this.$emit('issuesUpdate')
              this.close()
            })
            .catch(() => {
              this.$set(this, 'saving', false)
              this.$set(this, 'error', true)
              this.errorMessage = "Unable to delete the issue. Please verify the data and retry."
            })
        })
        .catch(() => {})
    },
    executeAction(event) {
      switch(event.target.value) {
        case 'edit':
          this.issueUpdate.problem = this.issue.problem
          this.issueUpdate.problemDescription = this.issue.problemDescription
          this.issueUpdate.ticketId = this.issue.ticketId
          this.$set(this, 'editing', true)
          break;
        case 'delete':
          this.delete()
          break;
      }
      event.target.selectedIndex = 0
    },
  },
  filters: {
    formatDate: (dateString) => {
      let date = moment(dateString)
      if (!date.isValid()) {
        return ''
      }

      return date.format('DD.MM.YYYY')
    },
    formatTimeAgo: (dateString) => {
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

  .issue-detail-card {
    width: 100%;
    background-color: white;
    border-radius: 10px;
    border: 1px solid $background-grey;
    box-shadow: 0 0.125em 0.25em 0 rgba(0,0,0,0.05);

    &>div {
      padding: 1.25em;
    }

    h5 {
      font-weight: normal;
      font-size: 1.125rem;
    }

    .form-control {
      font-size: 80%;
    }

    small {

      &.text-muted {
        color: $text-muted-grey !important;
      }
    }

    input[readonly] {
      background: white;
      border-color: $background-grey;
      color: $text-muted-grey;
    }

    textarea.description {
      border: 1px solid $background-grey;
      border-radius: 0.25rem;
      padding: 0.25em 0.75em;
      resize: none;
      font-size: 0.8em;
      color: $text-grey;

      &.description-disabled {
        color: $text-muted-grey;
      }
    }

    button.location-description-button {
      background: $lighter-grey;
      color: white;
      border: none;
      border-radius: 1rem;
      display:block;
      width: 100%;
      cursor: pointer;
      font-size: 0.8rem;

      &.location-description-button-active {
        background: $status-blue;
        color: white;
      }

      &[disabled] {
        cursor: default;
        opacity: 0.6;
      }
    }

    .location-images-outer-wrapper {
      overflow: auto;
      overflow-x: hidden;
      min-height: 240px;
    }

    .location-images-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .location-image-wrapper {

        display: inline-block;
        position: relative;
        cursor: pointer;
        text-align: center;

        .location-image {
          width: 100%;
        }

        .btn-delete {
          position: absolute;
          top: 0.45rem;
          right: 0.125rem;
        }
      }
    }


    .image-upload-input {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }

    .btn-image-upload {
      background: $light-blue;
      color: white;
      cursor: pointer;
      font-size: 0.8rem;

      &:hover {
        background: $lighter-blue;
      }
    }
  }

  .issue-header {
    width: 100%;
    font-size: 1.25rem;
    color: white;
    background: $background-blue;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
  }

  .issue-solution-body {
    font-size: 1.25rem;
    color: $text-grey;
    background: white;
  }

  .issue-problem-description {
    white-space: pre-wrap;
  }

    .btn {
      padding: 0.1em 0.5em;
      font-size: 0.9em;

      &.btn-outline-secondary {
        border-color: $grey;

        &:hover {
          background: $grey;
        }
      }

      &.btn-outline-secondary-white {
        border-color: white;
        color: white;

        &:hover {
          background: white;
          color: $grey;
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

    &.btn-issue-comment {
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

  .issue-comment-separator {
    border-bottom: 1px solid $lighter-blue;
  }

</style>
