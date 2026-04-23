<template>
  <v-row>
    <v-col v-for="sub in computedSubs" :key="sub.compliance_package" cols="auto">
      <unified-card-wrapper :title="sub.compliance_package">
        <!-- Responsive layout: side-by-side only on xl+ screens, stacked on everything else -->
        <div class="d-flex flex-row justify-space-around">
          <!-- Framework section - horizontal layout when stacked on smaller screens -->
          <div class="flex-shrink-0 mb-2 mb-xl-0">
            <framework-section :progress="sub.progress" :score="sub.score" />
          </div>

          <!-- Chart container -->
          <v-card flat outlined class="rounded-xl d-flex align-center px-2 ml-2 mt-2 mb-2 flex-grow-1">
            <progress-box :title="$t('table.status')" :chart="true" :stats="sub.chartStats" class="w-100" />
          </v-card>
        </div>
      </unified-card-wrapper>
    </v-col>
  </v-row>
</template>

<script>
import { getSubscriptionChart } from "@/api/audit-api"
import Chart from "../charts/Chart.vue"
import FrameworkSection from "./FrameworkSection.vue"

import { getStatusColor } from "@/helpers/color-generators"
import UnifiedCardWrapper from "./UnifiedCardWrapper.vue"
import ProgressBox from "../custom-table/ProgressBox.vue"

export default {
  components: { Chart, FrameworkSection, UnifiedCardWrapper, ProgressBox },
  name: "ContractsViewTwo",
  data() {
    return {
      subscriptions: []
    }
  },
  computed: {
    computedSubs() {
      const result = this.subscriptions.map((sub) => {
        // Keep existing transformation for backwards compatibility if needed
        sub.labels = []
        sub.datasets = [{ data: [], backgroundColor: [] }]
        console.log("SUBS", sub)

        // Add safety check for sub.statuses
        if (sub.statuses && Array.isArray(sub.statuses)) {
          sub.statuses.forEach((status) => {
            sub.labels.push(status?.label)
            sub.datasets[0].data.push(status?.value)
            sub.datasets[0].backgroundColor.push(status?.color)
          })

          // NEW: Transform data for ProgressBox
          sub.chartStats = sub.statuses.map((status, index) => ({
            id: index,
            name: status?.label || `Item ${index}`,
            count: status?.value || 0,
            color: status?.color || "#000000"
          }))
        } else {
          // Handle case where statuses is undefined or not an array
          console.warn("sub.statuses is undefined or not an array for:", sub)
          sub.chartStats = []
        }

        console.log("sub", sub)
        return sub
      })
      console.log("result", result)
      return result
    }
  },
  methods: {
    getStatusColor,
    fetchChart() {
      getSubscriptionChart(this.$axios).then((res) => {
        this.subscriptions = res.data.subscriptions
        console.log("Subscriptions", this.subscriptions)
      })
    }
  },
  mounted() {
    this.fetchChart()
  }
}
</script>
