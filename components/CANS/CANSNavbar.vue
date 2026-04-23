<template>
  <v-container class="cans-navbar">
    <v-btn :text="showMessageForm" @click="openForm" small :color="formBtn.color">
      <v-icon left small>{{ formBtn.icon }}</v-icon>
      {{ formBtn.text }}
    </v-btn>
    <v-btn v-if="expandBtn.show" small @click="toggleAllMessages" :color="expandBtn.color" class="mx-2">
      {{ expandBtn.text }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
  name: "CANSNavbar",
  props: {},
  computed: {
    ...mapState(["isRTL"]),
    ...mapState("posts", ["expandAll", "showMessageForm", "posts"]),
    formBtn() {
      let info = { text: this.$t("page.create"), icon: "mdi-plus", color: "primary" }
      if (this.showMessageForm) {
        info = { text: this.$t("page.back"), icon: this.isRTL ? "mdi-chevron-right" : "mdi-chevron-left", color: "" }
      }
      return info
    },
    expandBtn() {
      let info = { text: this.$t("page.expand_all"), color: "secondary" }
      if (this.expandAll) {
        info = { text: this.$t("page.minimize_all"), color: "warning" }
      }

      info.show = !this.showMessageForm && this.posts.length > 0

      return info
    }
  },
  methods: {
    ...mapActions("posts", ["toggleAllMessages", "toggleShowMessageForm", "setEditFormValue"]),
    openForm() {
      this.toggleShowMessageForm()
      this.setEditFormValue(false)
    }
  }
}
</script>

<style scoped>
.cans-navbar {
  position: sticky;
  top: 0;
  background-color: white; /* or any color that matches your design */
  z-index: 1;
}
</style>
