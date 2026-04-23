<template>
  <div class="audit-percentage-chart">
    <h3 class="text-center mb-4">{{ processedTitle }}</h3>
    <chart
      type="bar"
      :chart-height="120"
      :chart-width="600"
      :chart-data="processedChartData"
      :chart-options="chartOptions"
    />
    <div class="custom-legend">
      <div v-for="item in legendItems" :key="item.label" class="legend-item">
        <span v-if="!isRTL" class="legend-box" :style="{ backgroundColor: item.color }" />
        <span class="legend-label">{{ item.label }}</span>
        <span v-if="isRTL" class="legend-box" :style="{ backgroundColor: item.color }" />
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "./charts/Chart.vue"
import arabicTextMixin from "@/mixins/arabicTextMixin"

export default {
  name: "AuditPercentageCompletedChart",
  components: { Chart },
  mixins: [arabicTextMixin],

  props: {
    percentCompleted: {
      type: Number,
      required: true,
      default: 0
    },
    title: {
      type: String,
      required: true
    }
  },

  computed: {
    processedTitle() {
      return this.processArabicText(this.title)
    },

    percentValue() {
      return Number(this.percentCompleted) || 0
    },

    workInProgress() {
      return 100 - this.percentValue
    },

    isRTL() {
      return this.$store.state.isRTL
    },

    formatPercent() {
      return (value) => {
        const fixed = value.toFixed(1)
        return this.isRTL ? `%${fixed}` : `${fixed}%`
      }
    },

    legendItems() {
      return [
        {
          label: `${this.$t("page.is_completed")} (${this.formatPercent(this.percentValue)})`,
          color: "#7ab541"
        },
        {
          label: `${this.$t("page.work_in_progress")} (${this.formatPercent(this.workInProgress)})`,
          color: "#e2be36"
        }
      ]
    },

    chartData() {
      return {
        labels: [""], // No Y-axis label
        datasets: [
          {
            label: `${this.$t("page.is_completed")} (${this.formatPercent(this.percentValue)})`,
            data: [this.percentValue],
            backgroundColor: "#7ab541",
            barPercentage: 0.8
          },
          {
            label: `${this.$t("page.work_in_progress")} (${this.formatPercent(this.workInProgress)})`,
            data: [this.workInProgress],
            backgroundColor: "#e2be36",
            barPercentage: 0.8
          }
        ]
      }
    },

    processedChartData() {
      if (!this.$store.state.isRTL) return this.chartData

      // Deep clone
      const processed = JSON.parse(JSON.stringify(this.chartData))

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
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                max: 100,
                callback: (value) => value + "%"
              },
              gridLines: {
                display: true
              }
            }
          ],
          yAxes: [
            {
              stacked: true,
              gridLines: {
                display: false
              },
              ticks: {
                display: false
              }
            }
          ]
        },
        plugins: {
          legend: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const label = data.datasets[tooltipItem.datasetIndex].label || ""
              const value = tooltipItem.xLabel
              return `${label}: ${this.formatPercent(value)}`
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.audit-percentage-chart {
  background: white;
  padding: 20px;
}

h3 {
  font-size: 18px;
  font-weight: 600;
  font-family: "Cairo", sans-serif;
}

.custom-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  direction: ltr;
  gap: 6px;
  font-size: 13px;
}

.legend-box {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  border-radius: 2px;
}
</style>
