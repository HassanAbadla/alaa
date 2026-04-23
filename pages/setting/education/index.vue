<template>
  <v-container>
    <v-card flat>
      <v-tabs v-model="tab">
        <v-tab v-for="item in items" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-container>
            <EduCategories />
          </v-container>
        </v-tab-item>
        <v-tab-item></v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import { layoutPicker } from "../../../helpers/auth"
import EduCategories from "../../../components/tables/EduCategories.vue"

export default {
  name: "PositionSettings",
  middleware: ["auth"],
  components: { EduCategories },
  layout: "dashboard-layout",
  data() {
    return {
      tab: null,
      items: [{ tab: this.$t("table.categories") }]
    }
  }
}
</script>
