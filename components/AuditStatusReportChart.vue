<template>
  <div class="audit-status-chart">
    <v-container class="pa-0">
      <h3 v-if="processedTitle" class="chart-title">{{ processedTitle }}</h3>
      <v-row align="center" justify="center" no-gutters>
        <v-col cols="auto">
          <chart
            type="pie"
            :chart-height="220"
            :chart-width="220"
            :chart-data="processedChartData"
            :chart-options="chartOptions"
          />
        </v-col>
        <v-col cols="auto" class="ml-8">
          <div v-for="(label, index) in processedChartData.labels" :key="index" class="legend-item mb-3">
            <v-row no-gutters align="center">
              <v-col cols="auto" class="mx-2">
                <v-sheet
                  :color="processedChartData.datasets[0].backgroundColor[index]"
                  width="20"
                  height="20"
                  rounded
                />
              </v-col>
              <v-col cols="auto">
                <span class="body-1 font-weight-medium">
                  {{ label }}: {{ $store.state.isRTL ? '%' : '' }}{{ processedChartData.datasets[0].data[index] }}{{ $store.state.isRTL ? '' : '%' }}
                </span>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Chart from "./charts/Chart.vue"
import arabicTextMixin from "@/mixins/arabicTextMixin"

export default {
  name: "AuditStatusReportChart",
  components: { Chart },
  mixins: [arabicTextMixin],

  props: {
    chartData: {
      type: Object,
      required: true,
      default: () => ({
        labels: [],
        datasets: []
      })
    },
    title: {
      type: String,
      default: ""
    }
  },

  computed: {
    processedTitle() {
      return this.processArabicText(this.title)
    },

    processedChartData() {
      if (!this.$store.state.isRTL) return this.chartData

      // Deep clone to avoid mutating props
      const processed = JSON.parse(JSON.stringify(this.chartData))

      // Process labels
      if (processed.labels) {
        processed.labels = processed.labels.map((label) => this.processArabicText(label))
      }

      // Process dataset labels
      if (processed.datasets) {
        processed.datasets = processed.datasets.map((dataset) => ({
          ...dataset,
          label: this.processArabicText(dataset.label)
        }))
      }

      return processed
    },

    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw || 0
                return `${label}: ${value}%`
              }
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.audit-status-chart {
  background: white;
  padding: 20px;
}

.legend-item {
  min-width: 180px;
}

.chart-title {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  font-family: "Cairo", sans-serif;
}
</style>
