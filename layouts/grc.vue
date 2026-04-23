<template>
  <v-app>
    <logged-in-nav-bar>
      <g-r-c-side-bar />
    </logged-in-nav-bar>
    <v-main>
      <toast-notification />
      <!-- <breadcrumbs /> -->

      <v-slide-y-transition>
        <modules-menu v-if="isShowingModules" />
      </v-slide-y-transition>

      <Nuxt />
    </v-main>
    <custom-drawer />

    <Footer :name="'GRC'" />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex"
import languageHandler from "~/mixins/languageHandler"
import CustomDrawer from "../components/CustomDrawer.vue"
import Footer from "@/components/Footer.vue"
import layoutHandler from "../mixins/layoutHandler"
import ModulesMenu from "../components/moduels/ModulesMenu.vue"

export default {
  components: { CustomDrawer, Footer, ModulesMenu },
  name: "grc",
  mixins: [languageHandler, layoutHandler],
  computed: {
    ...mapGetters("modules", ["isShowingModules"])
  }
}
</script>
