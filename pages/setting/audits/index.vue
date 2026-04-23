<template>
  <v-card flat class="pa-4">
    <v-tabs v-model="tab">
      <v-tab v-for="item in items" :key="item.tab">
        {{ item.tab }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <AuditEvidenceCategories />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { layoutPicker } from "../../../helpers/auth"
import AuditEvidenceCategories from "../../../components/tables/AuditEvidenceCategories.vue"

export default {
  name: "PositionSettings",
  middleware: ["auth"],
  components: { AuditEvidenceCategories },
  layout: "dashboard-layout",
  data() {
    return {
      tab: null,
      items: [{ tab: this.$t("table.categories") }]
    }
  }
}
</script>
