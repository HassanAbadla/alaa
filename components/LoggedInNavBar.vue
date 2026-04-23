<template>
  <div>
    <v-navigation-drawer :right="isRTL" v-model="drawerOpen" app>
      <slot></slot>
    </v-navigation-drawer>

    <v-app-bar flat app dense :extension-height="extensionHeight" color="globalBg">
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>

      <!-- Selected Module Name -->
      <v-toolbar-title class="ml-4 d-flex align-center">
        <v-icon :color="'primary'" class="mr-2" size="24">
          {{ selectedModule?.icon }}
        </v-icon>
        <div class="text-h6 font-weight-medium primary--text">{{ selectedModule?.name }}</div>
      </v-toolbar-title>

      <v-spacer />

      <theme-toggle />
      <modules-menu-inline ref="modulesMenu" />
      <!-- <modules-toggle-btn /> -->
      <notification-button />
      <change-language />
      <v-btn class="text-capitalize outlined" text color="secondary" :to="localePath('/settings')">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <logout-btn />
    </v-app-bar>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import ToggleApps from "./ToggleApps.vue"
import Logo from "./landing-page/Logo.vue"
import LogoutBtn from "./LogoutBtn.vue"
import ModulesToggleBtn from "./moduels/ModulesToggleBtn.vue"
import ModulesMenuInline from "./moduels/ModulesMenuInline.vue"
import NotificationButton from "./notifications/NotificationButton.vue"

export default {
  components: {
    ToggleApps,
    Logo,
    LogoutBtn,
    ModulesToggleBtn,
    ModulesMenuInline,
    NotificationButton
  },
  name: "LoggedInNavBar",
  computed: {
    ...mapState(["isRTL"]),
    ...mapGetters("modules", {
      selectedModule: "getSelectedModule",
      isShowingModules: "isShowingModules"
    }),

    extensionHeight() {
      return this.isShowingModules ? 80 : 0
    },

    // Use computed property with getter/setter for two-way binding with drawer store
    drawerOpen: {
      get() {
        return this.$store.getters["sidebarDrawer/isOpen"]
      },
      set(value) {
        this.$store.dispatch("sidebarDrawer/setOpen", value)
      }
    }
  },
  methods: {
    ...mapActions("sidebarDrawer", { toggleDrawer: "toggle" })
  }
}
</script>

<style scoped>
/* Smooth transition for extension height changes */
.v-app-bar {
  transition: height 0.3s ease;
}
</style>
