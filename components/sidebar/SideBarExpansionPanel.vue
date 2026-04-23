<template>
  <v-expansion-panel class="elevation-0 rounded-0 custom-expansion-panel">
    <v-expansion-panel-header class="py-1 custom-header primary-header">
      <v-row no-gutters align="center">
        <v-col>
          <div class="d-flex align-center">
            <v-icon dense :class="`${isRTL ? 'ml-2' : 'mr-2'} white--text`">{{ icon }}</v-icon>
            <span class="body-2 white--text text--darken-2 text-uppercase font-weight-bold">{{ title }}</span>
          </div>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager>
      <div class="py-2">
        <slot></slot>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from "vuex"
export default {
  name: "SideBarExpansionPanel",
  props: {
    title: { type: String, required: true },
    icon: { type: String, default: null }
  },
  computed: {
    ...mapState(["isRTL"]),
    primaryColor() {
      return this.$vuetify.theme.themes.light.primary
    }
  }
}
</script>

<style lang="scss">
.primary-header {
  background-color: v-bind(primaryColor) !important;
}
.v-expansion-panel-header__icon .v-icon {
  color: white !important;
}
.v-expansion-panel--active + .v-expansion-panel {
  margin-top: 0px !important;
}
.v-expansion-panel--active:not(:first-child),
.v-expansion-panel--active + .v-expansion-panel {
  margin-top: 0px !important;
}
</style>
