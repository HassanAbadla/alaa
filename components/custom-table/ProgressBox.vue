<template>
  <v-card flat class="text-center">
    <v-card-title class="text-subtitle-1 font-weight-bold pb-2 justify-center">
      {{ title }}
      <v-tooltip v-if="info" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon small class="mx-1" color="grey" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
        </template>
        <span>{{ info }}</span>
      </v-tooltip>
    </v-card-title>
    <v-card-text class="pa-2">
      <template v-if="!chart">
        <div class="text-h5 font-weight-bold">{{ content }}</div>
      </template>
      <template v-else>
        <v-container class="pa-0">
          <v-row align="center" justify="center" no-gutters style="min-height: 180px">
            <v-col cols="auto">
              <div v-memo="[chartValues, chartLabels]">
                <chart
                  :key="chartComponentKey"
                  :type="type"
                  :chart-height="chartHeight"
                  :chart-width="chartWidth"
                  :chart-data="chartData"
                  :chart-options="chartComputedOptions"
                  @chart-click="handleChartClick"
                />
              </div>
            </v-col>
            <v-col v-if="!isGroupedBar && !hideTemplateLegend" cols="auto" class="ml-4">
              <div v-for="stat in stats" :key="stat.id" @click="handleStatClick(stat)" class="stat-row">
                <v-row
                  no-gutters
                  align="center"
                  :class="[
                    isRTL ? 'flex-row-reverse' : '',
                    'stat-item',
                    selectedStatId === stat.id ? 'selected-stat' : ''
                  ]"
                >
                  <v-col cols="auto" class="mr-2">
                    <v-sheet :color="stat.color" width="18" height="18" rounded="circle" />
                  </v-col>
                  <v-col cols="auto">
                    <span class="caption">{{ stat.name }}: {{ stat.count }}</span>
                  </v-col>
                </v-row>
              </div>
            </v-col>
            <v-col v-else cols="auto" class="ml-4">
              <div v-for="(dataset, index) in groupedDatasets" :key="index" class="stat-row">
                <v-row no-gutters align="center" :class="[isRTL ? 'flex-row-reverse' : '', 'stat-item']">
                  <v-col cols="auto" class="mr-2">
                    <v-sheet :color="dataset.backgroundColor" width="18" height="18" rounded="circle" />
                  </v-col>
                  <v-col cols="auto">
                    <span class="caption">{{ dataset.label }}</span>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
          <span v-if="showChartInstructions && !isGroupedBar" class="caption font-weight-bold">
            <v-icon small>mdi-filter</v-icon>
            {{ $t("page.click_to_filter") }}
          </span>
        </v-container>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import Chart from "../charts/Chart.vue"
import { mapState } from "vuex"

export default {
  name: "ProgressBox",
  components: { Chart },

  props: {
    type: {
      type: String,
      default: "pie"
    },
    chartWidth: {
      type: [String, Number],
      default: 130
    },
    chartHeight: {
      type: [String, Number],
      default: 130
    },
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    chart: {
      type: Boolean,
      default: false
    },
    stats: {
      type: Array,
      default: () => []
    },
    filterType: {
      type: String,
      default: ""
    },
    selectedFilterId: {
      type: [String, Number],
      default: null
    },
    info: {
      type: String,
      default: null
    },
    showChartInstructions: { type: Boolean, default: false },
    // New prop for grouped bar chart
    grouped: {
      type: Boolean,
      default: false
    },
    groupedDatasetKeys: {
      type: Array,
      default: () => []
    },
    groupedDatasetLabels: {
      type: Array,
      default: () => []
    },
    groupedDatasetColors: {
      type: Array,
      default: () => ["#42A5F5", "#66BB6A"]
    }
  },

  data() {
    return {
      chartComponentKey: 0,
      previousChartData: null,
      selectedStatId: null,
      hoveredIndex: -1
    }
  },

  computed: {
    ...mapState(["isRTL"]),

    isGroupedBar() {
      return this.grouped && this.type === "bar"
    },

    chartValues() {
      if (this.isGroupedBar) {
        return []
      }
      return (this.stats || []).map((item) => item.count)
    },

    chartLabels() {
      if (this.isGroupedBar) {
        return (this.stats || []).map((item) => item.name)
      }
      return (this.stats || []).map((item) => item.name)
    },

    chartColors() {
      return (this.stats || []).map((item) => item.color)
    },

    groupedDatasets() {
      if (!this.isGroupedBar) return []

      return this.groupedDatasetKeys.map((key, index) => ({
        label: this.groupedDatasetLabels[index] || key,
        data: (this.stats || []).map((item) => item[key] || 0),
        backgroundColor: this.groupedDatasetColors[index] || "#42A5F5",
        borderWidth: 0
      }))
    },

    chartData() {
      if (this.isGroupedBar) {
        return {
          labels: this.chartLabels,
          datasets: this.groupedDatasets
        }
      }

      return {
        labels: this.chartLabels,
        datasets: [
          {
            data: this.chartValues,
            backgroundColor: this.chartColors,
            hoverBackgroundColor: this.chartColors,
            borderWidth: this.getBorderWidths()
          }
        ]
      }
    },

    chartComputedOptions() {
      const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 750
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || context.label || ""
                const value = context.raw || 0
                return `${label}: ${value}`
              }
            }
          }
        }
      }

      if (this.isGroupedBar) {
        return {
          ...baseOptions,
          scales: {
            x: {
              stacked: false
            },
            y: {
              stacked: false,
              beginAtZero: true
            }
          },
          barThickness: 20,
          categoryPercentage: 0.8,
          barPercentage: 0.9
        }
      }

      return {
        ...baseOptions,
        barThickness: 20,
        grouped: true,
        onClick: this.handleChartClick
      }
    }
  },

  watch: {
    chartValues: {
      deep: true,
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.updateChart()
        }
      }
    },

    chartLabels: {
      deep: true,
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.updateChart()
        }
      }
    },

    selectedFilterId: {
      immediate: true,
      handler(newVal) {
        this.selectedStatId = newVal
      }
    },

    stats: {
      deep: true,
      handler() {
        this.updateChart()
      }
    }
  },

  methods: {
    updateChart() {
      const currentData = JSON.stringify(this.chartData)
      if (this.previousChartData !== currentData) {
        this.chartComponentKey += 1
        this.previousChartData = currentData
      }
    },

    getBorderWidths() {
      if (this.isGroupedBar) return []
      return this.chartValues.map((_, index) => (this.selectedStatId === this.stats[index]?.id ? 2 : 0))
    },

    handleStatClick(stat) {
      if (this.isGroupedBar) return

      const isDeselecting = this.selectedStatId === stat.id
      this.selectedStatId = isDeselecting ? null : stat.id

      this.$emit("filter-change", {
        filterType: this.filterType,
        filterId: isDeselecting ? null : stat.id,
        statName: stat.name
      })

      this.updateChart()
    },

    handleChartClick(_, elements) {
      if (this.isGroupedBar) return

      if (elements && elements.length > 0) {
        const index = elements[0].index
        const stat = this.stats[index]
        if (stat) {
          this.handleStatClick(stat)
        }
      }
    }
  }
}
</script>

<style scoped>
.stat-row {
  transition: all 0.2s ease;
}

.stat-item {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  margin: 2px 0;
  transition: background-color 0.2s ease;
}

.stat-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.selected-stat {
  background-color: rgba(0, 0, 0, 0.1);
}

.v-sheet {
  transition: background-color 0.3s ease;
}
</style>
