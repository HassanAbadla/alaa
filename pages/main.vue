<template>
  <v-container fluid fill-height class="grey lighten-5">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <v-card flat color="transparent" class="pa-8">
          <v-card-title class="display-2 justify-center mb-4">
            {{ $t("welcome.title") }}
          </v-card-title>

          <v-card-text class="subtitle-1 mb-6 grey--text text--darken-1">
            {{ $t("welcome.subtitle") }}
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn
              v-if="!isShowingModules"
              color="primary"
              large
              elevation="2"
              @click="setShowModules(true)"
              class="px-8"
            >
              <v-icon left>mdi-view-module</v-icon>
              {{ $t("page.show_modules") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "Main",
  layout: "dashboard-layout",
  middleware: ["auth"],
  computed: {
    ...mapGetters("modules", ["isShowingModules"])
  },
  methods: {
    ...mapActions("modules", ["setShowModules"])
  },
  mounted() {
    this.setShowModules(true)
  }
}
</script>

<style scoped>
/* Minimal custom styles */
</style>
