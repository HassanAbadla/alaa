<!-- AssetMappedRisks.vue -->
<template>
  <div>
    <v-alert v-if="!items || items.length === 0" type="info" text class="ma-0">No mapped risks available</v-alert>

    <div v-else class="mapped-risks-list">
      <v-list dense>
        <v-list-item v-for="(risk, index) in items" :key="risk.id" class="py-2">
          <v-list-item-content>
            <v-list-item-title class="d-flex justify-space-between align-center">
              <router-link :to="`/grc/risk-register/${risk.id}`" class="text-decoration-none font-weight-medium">
                {{ risk.name }}
              </router-link>

              <div class="d-flex">
                <!-- Inherent Risk Rating -->
                <v-chip
                  x-small
                  class="mr-2"
                  :color="getRatingColor(risk.risk_priority?.color)"
                  :text-color="getTextColorForBackground(risk.risk_priority?.color || 'grey')"
                >
                  {{ risk.risk_priority?.name || "N/A" }}
                </v-chip>

                <!-- We don't have residual rating in the sample data, but you can add it here if available -->
              </div>
            </v-list-item-title>

            <v-list-item-subtitle class="d-flex justify-space-between mt-1">
              <span>{{ risk.risk_type?.name?.en || "N/A" }}</span>
              <span>{{ risk.owner?.full_name || "N/A" }}</span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script>
import { colorUtils } from "@/mixins/colorUtils"

export default {
  name: "AssetMappedRisks",
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  mixins: [colorUtils],
  methods: {
    getRatingColor(color) {
      return color || "grey"
    }
  }
}
</script>

<style scoped>
.mapped-risks-list {
  max-height: 300px;
  overflow-y: auto;
}
</style>
