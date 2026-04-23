<template>
  <v-app>
    <nav-bar />
    <maintenance-banner />
    <v-main>
      <toast-notification />
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import MaintenanceBanner from "../components/landing-page/MaintenanceBanner.vue"
import languageHandler from "../mixins/languageHandler"
import layoutHandler from "../mixins/layoutHandler"

export default {
  name: "default-layout",
  components: { MaintenanceBanner },
  mixins: [languageHandler, layoutHandler]
}
</script>
