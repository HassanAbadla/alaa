<template>
  <div>
    <form-wrapper v-if="!fetchError && !loading" :title="title" @submit="submitCANSMessage" :loading="isSubmittingPost">
      <user-selector
        v-model="fields.selected_users"
        :available-users="availableUsers"
        @input="clearError('selected_users')"
        :disabled="ossUsers"
      />

      <custom-input
        :label="$t('form.title')"
        v-model="fields.title"
        :required="true"
        :errors="errors.title"
        @clear-errors="clearError('title')"
      />
      <custom-text-area
        :label="$t('form.body')"
        v-model="fields.body"
        :required="true"
        :errors="errors.body"
        @clear-errors="clearError('body')"
      />

      <v-card-text class="pa-0 mb-2">
        <p class="text-subtitle-1 font-weight-medium">{{ $t("form.notification_options") }}</p>
      </v-card-text>

      <custom-checkbox :label="$t('form.email')" v-model="fields.send_email" @input="clearError('email')" />
      <!-- hiding SMS until backend implimentation -->
      <!-- <custom-checkbox :label="$t('form.sms')" v-model="fields.sms" @input="clearError('sms')" /> -->
    </form-wrapper>
    <message-display
      v-if="fetchError"
      :messageTitle="fetchError.title"
      :messageText="fetchError.text"
      :code="fetchError.code"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import MessageDisplay from "../MessageDisplay.vue"
import UserSelector from "../UserSelector.vue"

export default {
  components: { UserSelector, MessageDisplay },
  name: "CANSMessageForm",

  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    itemId: { type: Number },
    postableType: { type: String, required: true },
    postableId: { type: Number, required: true },
    usersApi: { type: Function, required: true },
    ossUsers: { type: Object, required: false },
    updateCount: { type: Function }
  },
  layout: "default",
  data() {
    return {
      fields: {
        title: "",
        body: "",
        selected_users: [],
        postable_type: this.postableType,
        postable_id: this.postableId,

        send_email: false,
        sms: false
      },
      errors: {},
      fetchError: null,
      availableUsers: []
    }
  },
  computed: {
    ...mapState("posts", ["posts", "isSubmittingPost", "isfetchingPost", "selectedPost"]),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.new_message")}`
    }
  },
  methods: {
    ...mapActions("posts", ["createPost", "updatePost", "toggleShowMessageForm"]),
    async submitCANSMessage() {
      try {
        this.editForm
          ? await this.updatePost({ postId: this.itemId, payload: this.fields })
          : await this.createPost(this.fields)

        if (this.updateCount) {
          this.updateCount(this.postableId)
        }
        this.resetFields()
      } catch (error) {
        console.error(error)
      }
    },
    async fetchCANSMessage() {
      this.fields = {
        ...this.fields,
        title: this.selectedPost?.title,
        body: this.selectedPost.body,
        send_email: this.selectedPost?.send_email || false,
        sms: this.selectedPost?.sms || false
      }
    },
    resetFields() {
      this.fields = {
        title: "",
        body: "",
        selected_users: [],
        postable_type: this.postableType,
        postable_id: this.postableId,

        send_email: false,
        sms: false
      }
    },
    clearError(field) {
      this.errors[field] = []
    },
    async fetchAvailableUsers() {
      try {
        if (this.ossUsers) {
          this.availableUsers = this.ossUsers
          this.fields.selected_users = this.ossUsers.map((user) => user.id)
          return
        }
        const response = await this.usersApi()
        this.availableUsers = response.data.data
      } catch (error) {
        console.error("Error fetching available users:", error)
      }
    }
  },
  mounted() {
    this.fetchAvailableUsers()
    if (this.editForm) {
      this.fetchCANSMessage()
    }
  }
}
</script>
