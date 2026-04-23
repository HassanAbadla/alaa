<template>
  <v-navigation-drawer
    v-model="drawerOpen"
    :width="drawerWidth"
    :right="!isRTL"
    temporary
    fixed
    overlay-opacity="0.8"
    overlay-color="rgba(0, 0, 0, .9)"
    content-class="custom-drawer"
  >
    <v-card v-if="drawerOpen" :width="drawerWidth" class="d-flex flex-column fill-height globalBg">
      <div class="sticky-header">
        <v-card-title class="title primary white--text py-4">
          {{ drawerTitle }}
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDrawer">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
      </div>
      <v-card-text class="scrollable-content">
        <component v-if="drawerComponentAsync" :is="drawerComponentAsync" v-bind="drawerProps" @close="closeDrawer" />
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex"

export default {
  name: "CustomDrawer",
  computed: {
    ...mapState("drawer", ["component", "props", "title", "width", "isOpen"]),
    ...mapState(["isRTL"]),

    drawerOpen: {
      get() {
        return this.isOpen
      },
      set(value) {
        this.setDrawerOpen(value)
      }
    },
    drawerComponentAsync() {
      return this.component ? () => import(`@/components/${this.component}.vue`) : null
    },
    drawerProps() {
      return this.props
    },
    drawerTitle() {
      return this.title
    },
    drawerWidth() {
      return this.width || 700
    }
  },
  methods: {
    ...mapActions("drawer", ["closeDrawer"]),
    ...mapMutations("drawer", ["setDrawerOpen"])
  }
}
</script>

<style scoped>
.custom-drawer {
  z-index: 9999 !important;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: inherit;
}

.scrollable-content {
  flex-grow: 1;
  overflow-y: auto;
}
</style>
