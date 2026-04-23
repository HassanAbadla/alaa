<template>
  <div class="domain-status-chart">
    <div class="chart-wrapper">
      <chart
        :type="'bar'"
        :chart-data="processedChartData"
        :chart-options="chartOptions"
        :chart-height="300"
        chart-width="100%"
      />
    </div>
  </div>
</template>

<script>
import Chart from "./charts/Chart.vue"
import arabicTextMixin from "@/mixins/arabicTextMixin"

export default {
  name: "DomainStatusChart",
  components: { Chart },
  mixins: [arabicTextMixin],

  props: {
    domainStatus: {
      type: Object,
      required: true
    }
  },

  computed: {
    chartData() {
      const domainStatus = this.domainStatus || {}

      console.log("🔍 Building chartData from:", domainStatus)

      // Extract domain label
      const domainLabel = domainStatus.compliance_item || ""

      // Get all status keys (exclude metadata keys)
      const excludeKeys = ["compliance_item", "id", "total"]
      const statusKeys = Object.keys(domainStatus).filter((key) => !excludeKeys.includes(key))

      console.log("📊 Found status keys:", statusKeys)

      // Build datasets dynamically
      const datasets = statusKeys.map((statusKey) => {
        const statusData = domainStatus[statusKey] || {}
        const count = Number(statusData?.count) || 0
        const color = statusData?.color || "#cccccc"

        console.log(`  - ${statusKey}: count=${count}, color=${color}`)

        return {
          label: `${statusKey} (${count})`,
          data: [count],
          backgroundColor: color
        }
      })

      const result = {
        labels: [domainLabel],
        datasets: datasets
      }

      console.log("✅ Final chartData:", result)

      return result
    },

    processedChartData() {
      if (!this.$store.state.isRTL) return this.chartData

      console.log("🔄 Processing chart data for RTL...")

      // Deep clone
      const processed = JSON.parse(JSON.stringify(this.chartData))

      // Process domain label (X-axis)
      if (processed.labels) {
        processed.labels = processed.labels.map((label) => {
          const result = this.processArabicText(label)
          console.log(`Label: "${label}" → "${result}"`)
          return result
        })
      }

      // Process dataset labels (legend)
      if (processed.datasets) {
        processed.datasets = processed.datasets.map((dataset, idx) => {
          const originalLabel = dataset.label
          const processedLabel = this.processArabicText(dataset.label)
          console.log(`Dataset ${idx} label: "${originalLabel}" → "${processedLabel}"`)

          return {
            ...dataset,
            label: processedLabel
          }
        })
      }

      console.log("✅ Processed chart data:", processed)

      return processed
    },

    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: false
            }
          ],
          yAxes: [
            {
              stacked: false,
              ticks: {
                beginAtZero: true
              }
            }
          ]
        },
        legend: {
          display: true,
          position: "top"
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const label = data.datasets[tooltipItem.datasetIndex].label || ""
              return label
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.domain-status-chart {
  width: 100%;
  font-family: "Cairo", sans-serif;
}

.chart-wrapper {
  width: 100%;
  min-width: 0;
}
</style>
