<template>
  <v-container class="comp-wrapper pa-0" fluid>
    <c-a-n-s-navbar @toggleAllMessages="toggleAllMessages" @toggleShowMessageForm="toggleShowMessageForm" />
    <c-a-n-s-message-form
      v-if="showMessageForm"
      :editForm="isEditForm"
      :itemId="selectedPost?.id"
      :postable-type="postableType"
      :postableId="postableId"
      :users-api="usersApi"
      :ossUsers="ossUsers"
      :updateCount="updateCount"
    />
    <CANSMessages v-else />
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"

import CANSMessageForm from "../forms/CANSMessageForm.vue"
import CANSMessages from "./CANSMessages.vue"
import CANSNavbar from "./CANSNavbar.vue"

export default {
  name: "CollaborationAlertsNotificationSystem",
  components: {
    CANSMessages,
    CANSNavbar,
    CANSMessageForm
  },
  props: {
    postableType: { type: String, required: true },
    usersApi: { type: Function, required: true },
    postableId: { type: Number, required: true },
    updateCount: { type: Function },
    ossUsers: { type: Array, required: false }
  },
  computed: {
    ...mapState("posts", ["expandAll", "showMessageForm", "isEditForm", "selectedPost"])
  },
  methods: {
    ...mapActions("posts", ["fetchAllPosts", "toggleAllMessages", "toggleShowMessageForm"])
  },
  async mounted() {
    await this.fetchAllPosts({ postableType: this.postableType, postableId: this.postableId })
  }
}
</script>
