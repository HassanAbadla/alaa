<template>
  <v-btn
    :color="isShowingModules ? 'primary' : 'grey darken-1'"
    :outlined="!isShowingModules"
    small
    depressed
    @click="toggleShowModules"
  >
    <v-icon left small>mdi-view-module</v-icon>
    {{ $t("page.modules") }}
  </v-btn>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
export default {
  name: "ModulesToggleBtn",
  computed: {
    ...mapGetters("modules", ["isShowingModules"])
  },
  methods: {
    ...mapActions("modules", ["toggleShowModules"])
  }
}
</script>

<style scoped>
.v-btn {
  text-transform: none !important;
}
</style>
