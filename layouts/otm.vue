<template>
  <v-app>
    <logged-in-nav-bar>
      <o-t-m-side-bar />
    </logged-in-nav-bar>
    <v-main>
      <toast-notification />
      <!-- <breadcrumbs /> -->
      <Nuxt />
    </v-main>
    <custom-drawer />

    <Footer :name="'OTM'" />
  </v-app>
</template>

<script>
import languageHandler from "~/mixins/languageHandler"
import CustomDrawer from "../components/CustomDrawer.vue"
import Footer from "@/components/Footer.vue"
import layoutHandler from "../mixins/layoutHandler"

export default {
  components: { CustomDrawer, Footer },
  name: "otm",
  mixins: [languageHandler, layoutHandler],

  head() {
    return {
      title: this.pageTitle
    }
  },

  computed: {
    pageTitle() {
      const userType = this.$auth.user.type?.code

      switch (userType) {
        case "c-owner":
          return this.$t("page_title.cowner")
        case "b-owner":
          return this.$t("page_title.bowner")
        case "owner":
          return this.$t("page_title.owner")
        case "sm":
          return this.$t("page_title.sm")
        case "eng":
          return this.$t("page_title.eng")
        case "eng_contracts":
          return this.$t("page_title.eng_contracts")
        case "eng_costing":
          return this.$t("page_title.eng_costing")
        default:
          return "OSS Platform"
      }
    }
  }
}
</script>

<style></style>
