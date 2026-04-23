<template>
  <v-can :permission="permission">
    <div class="mx-1">
      <v-divider></v-divider>
      <v-expansion-panels flat>
        <v-expansion-panel class="elevation-0 rounded-0">
          <v-expansion-panel-header class="py-1 custom-header non-active-bg">
            <v-row no-gutters align="center">
              <v-col>
                <div class="d-flex align-center">
                  <v-icon dense :class="`${isRTL ? 'ml-2' : 'mr-2'}`" color=" darken-2">mdi-cog</v-icon>
                  <span class="body-2 text--darken-2">{{ $t("sidebar.system") }}</span>
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="white">
            <v-list dense>
              <v-can v-for="item in menuItems" :key="item.to" :permission="item.permission">
                <system-menu-item :to="item.to" :title="item.title" />
              </v-can>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-can>
</template>

<script>
import VCan from "../VCan.vue"
import SystemMenuItem from "./SystemMenuItem.vue"
import { mapState } from "vuex"

export default {
  name: "SystemMenu",
  components: {
    SystemMenuItem,
    VCan
  },
  props: {
    menuItems: {
      type: Array
    },
    permission: { type: String, required: true }
  },
  computed: {
    ...mapState(["isRTL"])
  },
  data() {
    return {}
  }
}
</script>

<style>
.non-active-bg {
  background-color: #f9f9f9 !important;
}
</style>
