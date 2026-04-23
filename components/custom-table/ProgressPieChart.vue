<template>
  <div class="d-flex flex-column align-center" :style="{ width: chartSize + 'px' }">
    <p v-if="title" class="text-subtitle-1 font-weight-bold pb-2 mb-0">{{ title }}</p>
    <chart
      :type="'pie'"
      :chart-data="chartData"
      :chart-options="chartOptions"
      :chart-height="chartSize"
      :chart-width="chartSize"
    />
  </div>
</template>

<script>
import Chart from "../charts/Chart.vue"

export default {
  components: { Chart },
  name: "ProgressPieChart",
  props: {
    title: { type: String, default: "" },
    labels: { type: Array, required: true },
    datasets: { type: Array, required: true },
    chartSize: { type: Number, default: 75 } // default keeps all existing usages unchanged
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: this.datasets.map((dataset) => ({
          ...dataset,
          borderWidth: 0 // This removes the white outline
        }))
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: "bottom"
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.parsed || 0
                return `${""} ${value.toFixed(1)}%`
              }
            }
          }
        }
      }
    }
  }
}
</script>
