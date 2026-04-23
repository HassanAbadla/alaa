<template>
  <v-container fluid>
    <v-card flat>
      <v-tabs v-model="tab">
        <v-tab v-for="item in items" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <AssetsTypes />
        </v-tab-item>
        <v-tab-item>
          <AssetsCategories />
        </v-tab-item>
        <v-tab-item>
          <AssetsManufacturers />
        </v-tab-item>
        <v-tab-item>
          <AssetsLocations />
        </v-tab-item>
        <v-tab-item>
          <AssetsStatuses />
        </v-tab-item>
        <v-tab-item>
          <AssetCriticalities />
        </v-tab-item>
        <v-tab-item>
          <AssetSegments />
        </v-tab-item>
        <v-tab-item>
          <AssetStandards />
        </v-tab-item>
        <v-tab-item>
          <AssetSectors />
        </v-tab-item>
        <v-tab-item>
          <AssetSubSectors />
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import AssetsTypes from "../../../components/tables/AssetsTypes.vue"
import AssetsCategories from "../../../components/tables/AssetsCategories.vue"
import AssetsManufacturers from "../../../components/tables/AssetsManufacturers.vue"
import AssetsLocations from "../../../components/tables/AssetsLocations.vue"
import AssetsStatuses from "../../../components/tables/AssetsStatuses.vue"
import AssetCriticalities from "../../../components/tables/AssetCriticalities.vue"
import AssetSegments from "../../../components/tables/AssetSegments.vue"
import AssetStandards from "../../../components/tables/AssetStandards.vue"
import AssetSectors from "../../../components/tables/AssetSectors.vue"
import AssetSubSectors from "../../../components/tables/AssetSubSectors.vue"
import { layoutPicker } from "../../../helpers/auth"

export default {
  name: "AssetsSettings",
  components: {
    AssetsTypes,
    AssetsCategories,
    AssetsManufacturers,
    AssetsLocations,
    AssetsStatuses,
    AssetCriticalities,
    AssetSegments,
    AssetStandards,
    AssetSectors,
    AssetSubSectors
  },
  middleware: ["auth"],
  layout: "dashboard-layout",
  data() {
    return {
      tab: null,
      items: [
        { tab: this.$t("page.assets_types") },
        { tab: this.$t("page.assets_categories") },
        { tab: this.$t("table.manufacturers") },
        { tab: this.$t("table.assets_location") },
        { tab: this.$t("table.status") },
        { tab: this.$t("table.classification") },
        { tab: this.$t("table.segments") },
        { tab: this.$t("table.standards") },
        { tab: this.$t("table.sectors") },
        { tab: this.$t("table.sub_sectors") }
      ]
    }
  }
}
</script>
