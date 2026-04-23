<template>
  <v-card-text>
    <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    <Chart
      v-else-if="chartData"
      :chart-title="$t('page.number_of_assined_controls')"
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
import { auditRoundReviewersChart } from "@/api/audit-api"
import Chart from "../charts/Chart.vue"

export default {
  name: "ReviewersDonePendingChart",
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
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              precision: 0,
              stepSize: 1,
              callback: function (value) {
                return Math.floor(value)
              }
            }
          }
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
      auditRoundReviewersChart(this.$route.params.id, this.$axios)
        .then((res) => {
          this.chartData = {
            labels: res.data.data.map((user) => user.full_name),
            datasets: [
              {
                label: this.$t("page.count"),
                data: res.data.data.map((user) => user.audit_items_review_count),
                backgroundColor: this.themeColors.secondary
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
