<template>
  <v-app>
    <logged-in-nav-bar>
      <o-s-s-side-bar />
    </logged-in-nav-bar>
    <v-main>
      <toast-notification />
      <!-- <breadcrumbs /> -->
      <Nuxt />
    </v-main>
    <custom-drawer />
    <!-- <footer :name="'GRC'" :version="1.0" /> -->

    <Footer :name="'Policy'" />
  </v-app>
</template>

<script>
import languageHandler from "~/mixins/languageHandler"
import CustomDrawer from "../components/CustomDrawer.vue"
import Footer from "@/components/Footer.vue"

export default {
  components: { CustomDrawer, Footer },
  name: "Policy",
  mixins: [languageHandler]
}
</script>

<style></style>
