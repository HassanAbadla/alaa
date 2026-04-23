<template>
  <v-expansion-panels flat multiple focusable color="primary" class="primary-sidebar">
    <slot></slot>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "SidebarExpansionPanelWrapper",
  computed: {
    primaryColor() {
      return this.$vuetify.theme.themes.light.primary
    }
  }
}
</script>

<style>
.v-expansion-panel-content__wrap {
  background-color: v-bind(primaryColor);
}
</style>
