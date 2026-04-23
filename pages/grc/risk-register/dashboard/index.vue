<template>
  <div class="chart-card">
    <div class="info-box">
      <span class="label">Risk Dashboard</span>
    </div>
    <client-only>
      <div class="charts-wrapper">
        <!-- Controls -->
        <div class="chart-container">
          <div class="info-box">
            <span class="label"># Controls:</span>
            <span class="value">{{ totalControls }}</span>
          </div>
          <Chart
            v-if="chartData"
            :type="'doughnut'"
            :chart-data="chartData"
            :chart-options="chartOptions"
            chart-title="Risks by Control Type"
            :plugins="[ChartDataLabels]"
            :chart-height="250"
            :chart-width="'100%'"
            :chart-max-width="300"
          />
        </div>

        <!-- Assets -->
        <div class="chart-container">
          <div class="info-box">
            <span class="label"># Assets:</span>
            <span class="value">{{ totalAssets }}</span>
          </div>
          <Chart
            v-if="assetChartData"
            :type="'pie'"
            :chart-data="assetChartData"
            :chart-options="chartOptions"
            chart-title="Risks by Asset Types"
            :plugins="[ChartDataLabels]"
            :chart-height="250"
            :chart-width="'100%'"
            :chart-max-width="300"
          />
        </div>
        <!-- Categories -->
        <div class="chart-container">
          <Chart
            v-if="categoryChartData"
            :type="'bar'"
            :chart-data="categoryChartData"
            :chart-options="chartOptions"
            chart-title="Total Risks by Categories"
            :plugins="[ChartDataLabels]"
            :chart-height="250"
            :chart-width="'100%'"
            :chart-max-width="300"
          />
        </div>

        <!-- Risk Treatment Table -->
        <div class="chart-container">
          <div class="info-box">
            <span class="label">Risk Treatments</span>
          </div>
          <table class="risk-table">
            <thead>
              <tr>
                <th>Risk ID</th>
                <th>Budget</th>
                <th>Treatment Duration Days</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="risk in riskTableData" :key="risk.riskId">
                <td>{{ risk.riskId }}</td>
                <td>{{ risk.budget.toLocaleString() }}</td>
                <td>{{ risk.treatmentDuration }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total</strong></td>
                <td>
                  <strong>{{ totalBudget.toLocaleString() }}</strong>
                </td>
                <td>
                  <strong>{{ totalDuration }}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <!-- Capacities -->
        <div class="chart-container">
          <Chart
            v-if="capacityChartData"
            :type="'bar'"
            :chart-data="capacityChartData"
            :chart-options="chartOptions"
            chart-title="Total Risks by Capacities"
            :plugins="[ChartDataLabels]"
            :chart-height="250"
            :chart-width="'100%'"
            :chart-max-width="300"
          />
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import Chart from "@/components/charts/Chart.vue"
import { mapGetters, mapActions } from "vuex"
import ChartDataLabels from "chartjs-plugin-datalabels"

export default {
  components: { Chart },
  layout: "dashboard-layout",

  data() {
    return {
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#333",
              font: { size: 9 },
              boxWidth: 10,
              boxHeight: 10,
              padding: 10,
              usePointStyle: true,
              pointStyle: "circle",
              generateLabels: (chart) => {
                return chart.data.labels.map((label, index) => ({
                  text: label,
                  fillStyle: chart.data.datasets[0].backgroundColor[index],
                  hidden: !chart.isDatasetVisible(0),
                  index
                }))
              }
            }
          },
          datalabels: {
            color: "#000",
            font: {
              size: 13,
              weight: "bold"
            },
            anchor: "center",
            align: "center",
            formatter: (value, context) => {
              const data = context.chart.data.datasets[0].data
              const total = data.reduce((sum, val) => sum + val, 0)
              const percentage = total ? ((value / total) * 100).toFixed(1) : 0
              return `${percentage}%`
            }
          }
        }
      }
    }
  },

  computed: {
    ...mapGetters("riskDashboard", [
      "chartData",
      "assetChartData",
      "categoryChartData",
      "totalAssets",
      "riskTableData",
      "capacityChartData"
    ]),
    totalControls() {
      return this.chartData?.datasets?.[0]?.data?.reduce((a, b) => a + b, 0) || 0
    },
    totalBudget() {
      return this.riskTableData.reduce((sum, r) => sum + r.budget, 0)
    },
    totalDuration() {
      return this.riskTableData.reduce((sum, r) => sum + r.treatmentDuration, 0)
    }
  },

  methods: {
    ...mapActions("riskDashboard", [
      "fetchChartData",
      "fetchAssetChartData",
      "fetchCategoryChartData",
      "fetchRiskTableData",
      "fetchCapacityChartData"
    ])
  },

  async mounted() {
    await this.fetchChartData()
    await this.fetchAssetChartData()
    await this.fetchCategoryChartData()
    await this.fetchRiskTableData()
    await this.fetchCapacityChartData()
  }
}
</script>
<style scoped>
.chart-card {
  padding: 15px;
}

.charts-wrapper {
  display: flex;

  gap: 20px;
}

.chart-container {
  flex: 1 1 300px;
  max-width: 320px;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
}

.info-box {
  background-color: #f4f4f4;
  padding: 12px 20px;
  border-radius: 6px;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.label {
  font-weight: 700;
  color: #333;
}

.value {
  color: #2ecc71;
  font-size: 1.2em;
}
.risk-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.risk-table th,
.risk-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.risk-table th {
  background-color: #f2f2f2;
}
</style>
