<template>
  <div class="d-flex flex-column w-100">
    <p v-if="title" class="caption font-weight-bold pb-0 mb-1">{{ title }}</p>
    <div class="chart-wrapper">
      <chart
        :type="'pie'"
        :chart-data="chartData"
        :chart-options="chartOptions"
        :chart-height="150"
        chart-width="100%"
      />
    </div>
  </div>
</template>

<script>
import Chart from "../charts/Chart.vue"
import { mapState } from "vuex"

export default {
  components: { Chart },
  name: "StatusChart",
  props: {
    title: { type: String, default: "" },
    labels: { type: Array, required: true },
    datasets: { type: Array, required: true }
  },
  computed: {
    ...mapState(["isRTL"]),

    chartData() {
      return {
        labels: this.labels,
        datasets: this.datasets
      }
    },

    legendPosition() {
      return this.isRTL ? "left" : "right"
    },

    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: this.legendPosition,
            align: "start",
            labels: {
              // Responsive legend styling
              boxWidth: this.$vuetify?.breakpoint?.xs ? 8 : 12,
              fontSize: this.$vuetify?.breakpoint?.xs ? 10 : 12,
              padding: this.$vuetify?.breakpoint?.xs ? 8 : 15,
              // Force vertical stacking by using point style and limiting width
              usePointStyle: true,
              pointStyle: "rect"
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.parsed || 0
                return `${label}: ${value.toFixed(1)}%`
              }
            }
          }
        }
      }
    }
  },
  methods: {
    getChartCanvas() {
      // Find the Chart component and return its canvas
      const chartComponent = this.$children.find((child) => child.$options.name === "Chart")
      return chartComponent ? chartComponent.$refs.chartCanvas : null
    }
  }
}
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  min-width: 0; /* Important for flex shrinking */
}
</style>
