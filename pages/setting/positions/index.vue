<template>
  <v-container>
    <v-card>
      <v-tabs v-model="tab">
        <v-tab v-for="item in items" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-container>
            <PositionCategories />
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container>
            <PositionLevels />
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import { layoutPicker } from "../../../helpers/auth"
import PositionCategories from "../../../components/tables/PositionCategories.vue"
import PositionLevels from "../../../components/tables/PositionLevels.vue"

export default {
  name: "PositionSettings",
  middleware: ["auth"],
  components: { PositionCategories, PositionLevels },
  layout: "dashboard-layout",
  data() {
    return {
      tab: null,
      items: [{ tab: this.$t("page.position_categories") }, { tab: this.$t("page.position_levels") }]
    }
  }
}
</script>
