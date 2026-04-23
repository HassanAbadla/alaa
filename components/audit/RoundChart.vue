<template>
  <v-card-text>
    <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    <Chart
      v-else-if="chartData"
      :key="chartKey"
      :type="'bar'"
      :chart-data="chartData"
      :chart-options="chartOptions"
      :chart-height="400"
      :chart-width="'100%'"
      :chart-max-width="1000"
    />
    <v-alert v-else type="error">Unable to load chart data.</v-alert>
  </v-card-text>
</template>

<script>
import { auditRoundRoundChart } from "@/api/audit-api"
import Chart from "../charts/Chart.vue"

export default {
  name: "RoundChart",
  components: {
    Chart
  },
  data() {
    return {
      chartKey: 0,
      chartData: null,
      loading: false,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{ stacked: true, ticks: { beginAtZero: true } }]
        },
        legend: {
          display: true,
          position: "top"
        }
      }
    }
  },
  mounted() {
    this.loadChartData()
  },
  computed: {
    themeColors() {
      const isDark = this.$vuetify.theme.dark

      return this.$vuetify.theme.themes[isDark ? "dark" : "light"]
    }
  },
  methods: {
    loadChartData() {
      this.loading = true
      this.chartData = null
      auditRoundRoundChart(this.$route.params.id, this.$axios)
        .then((res) => {
          console.log("auditRoundRoundChart", res.data.data)
          this.chartData = {
            labels: res.data.data.map((item) => item?.compliance_item),
            datasets: [
              {
                label: this.$t("page.total"),
                data: res.data.data.map((item) => item.total),
                backgroundColor: this.themeColors.primary
              },
              {
                label: this.$t("page.done"),
                data: res.data.data.map((item) => item.done),
                backgroundColor: this.themeColors.secondary
              },
              {
                label: this.$t("page.pending"),
                data: res.data.data.map((item) => item.pending),
                backgroundColor: this.themeColors.tertiary || this.themeColors.accent
              }
            ]
          }
          this.forceChartRerender()
        })
        .catch((error) => {
          console.error("Error loading chart data:", error)
          this.chartData = null
        })
        .finally(() => {
          this.loading = false
        })
    },
    forceChartRerender() {
      this.chartKey += 1
    }
  }
}
</script>
