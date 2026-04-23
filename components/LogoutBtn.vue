<template>
  <v-btn class="text-capitalize" text color="tertiary" @click="logout">
    <v-icon v-if="!iconStyle">mdi-logout</v-icon>
    {{ $t("auth.logout") }}
    <v-icon v-if="iconStyle" small class="mx-1" :style="iconStyles">mdi-logout</v-icon>
  </v-btn>
</template>

<script>
import { mapState } from "vuex"
export default {
  name: "LogoutBtn",
  props: { iconStyle: { type: String, default: "" } },
  methods: {
    logout() {
      // const userIsGRC = this.$auth.user.tenant.is_grc
      // let path = userIsGRC ? "/grc" : "/pmis"
      // if (this.$auth.user.type) {
      //   path = "/oss"
      // }
      // if (this.$auth.user.tenant.company_name === "University of Tabouk") {
      //   path = "/ut"
      // }
      this.$auth.logout().then(() => {
        this.$router.push(this.localePath("/"))
      })
    }
  },
  computed: {
    ...mapState(["isRTL"]),
    iconStyles() {
      return this.isRTL ? { transform: "scaleX(-1)" } : {}
    }
  }
}
</script>

<style></style>
