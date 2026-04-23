<template>
  <v-card-text>
    <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    <Chart
      v-else-if="chartData"
      :chart-title="$t('page.assigned_controls')"
      :key="chartKey"
      :type="'bar'"
      :chart-data="chartData"
      :chart-options="chartOptions"
      :chart-height="400"
      :chart-width="'500px'"
      :chart-max-width="1000"
    />
    <v-alert v-else type="error">Unable to load chart data.</v-alert>
  </v-card-text>
</template>

<script>
import Chart from "../charts/Chart.vue"
import { userChart } from "../../api/user-api"

export default {
  name: "UserMasterDashboard",
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
          xAxes: [
            {
              stacked: true
              // barPercentage: 0.1, // Adjust this value to change bar width
              // categoryPercentage: 0.8
            }
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                callback: function (value) {
                  if (Math.floor(value) === value) {
                    return value
                  }
                }
              }
            }
          ]
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
  methods: {
    loadChartData() {
      this.loading = true
      this.chartData = null
      userChart(this.$axios)
        .then((res) => {
          this.chartData = {
            labels: res.data.data.map((item) => item.compliance_package),
            datasets: [
              {
                label: this.$t("page.count"),
                data: res.data.data.map((item) => item.audit_reviews_count),
                backgroundColor: this.$vuetify.theme.themes.light.secondary
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
