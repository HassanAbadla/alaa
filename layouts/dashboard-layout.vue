<template>
  <v-app class="custom-bg">
    <logged-in-nav-bar>
      <g-r-c-side-bar />
    </logged-in-nav-bar>

    <v-main>
      <toast-notification />
      <!-- <breadcrumbs /> -->

      <div>
        <Nuxt />
      </div>
    </v-main>

    <custom-drawer />
    <Footer :name="''" />
  </v-app>
</template>

<script>
import { mapActions } from "vuex"
import languageHandler from "~/mixins/languageHandler"
import CustomDrawer from "../components/CustomDrawer.vue"
import Footer from "@/components/Footer.vue"
import layoutHandler from "../mixins/layoutHandler"
import Breadcrumbs from "../components/Breadcrumbs.vue"

export default {
  components: { CustomDrawer, Footer, Breadcrumbs },
  name: "dashboard-layout",
  mixins: [languageHandler, layoutHandler],
  computed: {
    globalBgColor() {
      return this.$vuetify.theme.themes.light.globalBg
    }
  },
  methods: {
    ...mapActions("modules", ["fetchModules"])
  },
  async mounted() {
    await this.fetchModules()
  }
}
</script>

<style>
.custom-bg {
  background-color: v-bind(globalBgColor) !important;
}

/* Force global treeview styles */
.v-treeview-node__root {
  min-height: 20px !important;
}
.v-treeview-node__content {
  min-height: 20px !important;
}
.v-treeview-node__label {
  font-size: 13px !important;
}
</style>
