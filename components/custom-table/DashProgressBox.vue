<template>
  <v-card flat class="text-center d-flex flex-column" style="height: 100%">
    <!-- TITLE -->
    <v-card-title class="text-subtitle-1 font-weight-bold pb-2 justify-center">
      {{ title }}
      <v-tooltip v-if="info" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon small class="mx-1" color="grey" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
        </template>
        <span>{{ info }}</span>
      </v-tooltip>
    </v-card-title>

    <!-- CONTENT -->
    <v-card-text class="pa-2 d-flex flex-column flex-grow-1">
      <!-- NO CHART -->
      <template v-if="!chart">
        <div
          class="d-flex flex-grow-1 align-center justify-center"
          :class="{ 'text-center': centerContent }"
          style="height: 100%"
        >
          <div class="text-h3 font-weight-bold">
            {{ content }}
          </div>
        </div>
      </template>
      <!-- WITH CHART -->
      <template v-else>
        <v-container class="pa-0 d-flex flex-column flex-grow-1">
          <!-- CHART + LEGEND -->
          <v-row
            align="center"
            justify="center"
            no-gutters
            class="flex-grow-1"
            style="min-height: 180px; flex-wrap: nowrap"
          >
            <!-- CHART -->
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

            <!-- LEGEND -->
            <v-col cols="auto" class="ml-4">
              <div
                :class="['legend-scroll', { scrollable: legendScrollable }]"
                :style="legendScrollable ? { maxHeight: legendMaxHeight + 'px' } : {}"
              >
                <!-- NORMAL LEGEND -->
                <template v-if="!isGroupedBar">
                  <div v-for="stat in stats" :key="stat.id" class="stat-row" @click="handleStatClick(stat)">
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
                </template>

                <!-- GROUPED BAR LEGEND -->
                <template v-else>
                  <div v-for="(dataset, index) in groupedDatasets" :key="index" class="stat-row">
                    <v-row no-gutters align="center" :class="[isRTL ? 'flex-row-reverse' : '', 'stat-item']">
                      <v-col cols="auto" class="mr-2">
                        <v-sheet :color="dataset.backgroundColor" width="18" height="18" rounded="circle" />
                      </v-col>
                      <v-col cols="auto">
                        <span class="caption">
                          {{ dataset.label }}
                        </span>
                      </v-col>
                    </v-row>
                  </div>
                </template>
              </div>
            </v-col>
          </v-row>

          <!--  INSTRUCTION (INSIDE CARD, BOTTOM) -->
          <div
            v-if="showChartInstructions && !isGroupedBar"
            class="d-flex align-center justify-center"
            style="
              font-size: 12px;
              color: #666;
              position: absolute;
              bottom: 0px;
              left: 50%;
              transform: translateX(-50%);
            "
          >
            <v-icon small class="mr-1">mdi-filter</v-icon>
            <span class="font-weight-bold">
              {{ $t("page.click_to_filter") }}
            </span>
          </div>
        </v-container>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import Chart from "../charts/Chart.vue"
import { mapState } from "vuex"

export default {
  name: "DashProgressBox",
  components: { Chart },

  props: {
    type: { type: String, default: "pie" },
    chartWidth: { type: [String, Number], default: 130 },
    chartHeight: { type: [String, Number], default: 130 },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    chart: { type: Boolean, default: false },
    stats: { type: Array, default: () => [] },
    filterType: { type: String, default: "" },
    selectedFilterId: { type: [String, Number], default: null },
    info: { type: String, default: null },
    showChartInstructions: { type: Boolean, default: false },
    centerContent: { type: Boolean, default: false },

    /* LEGEND */
    legendScrollable: { type: Boolean, default: false },
    legendMaxHeight: { type: [Number, String], default: 140 },

    /* GROUPED BAR */
    grouped: { type: Boolean, default: false },
    groupedDatasetKeys: { type: Array, default: () => [] },
    groupedDatasetLabels: { type: Array, default: () => [] },
    groupedDatasetColors: {
      type: Array,
      default: () => ["#42A5F5", "#66BB6A"]
    }
  },

  data() {
    return {
      chartComponentKey: 0,
      selectedStatId: null
    }
  },

  computed: {
    ...mapState(["isRTL"]),

    isGroupedBar() {
      return this.grouped && this.type === "bar"
    },

    chartValues() {
      return this.stats.map((item) => item.count)
    },

    chartLabels() {
      return this.stats.map((item) => item.name)
    },

    chartColors() {
      // No selection → normal behavior
      if (!this.selectedStatId) {
        return this.stats.map((item) => item.color)
      }

      // Find selected stat
      const selected = this.stats.find((s) => s.id === this.selectedStatId)
      if (!selected) {
        return this.stats.map((item) => item.color)
      }

      // Make ALL slices the selected color
      return this.stats.map(() => selected.color)
    },

    groupedDatasets() {
      if (!this.isGroupedBar) return []
      return this.groupedDatasetKeys.map((key, index) => ({
        label: this.groupedDatasetLabels[index] || key,
        data: this.stats.map((item) => item[key] || 0),
        backgroundColor: this.groupedDatasetColors[index]
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
            borderWidth: 0
          }
        ]
      }
    },

    chartComputedOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        onClick: this.handleChartClick
      }
    }
  },

  methods: {
    handleStatClick(stat) {
      const deselect = this.selectedStatId === stat.id
      this.selectedStatId = deselect ? null : stat.id

      // force chart redraw
      this.chartComponentKey++

      this.$emit("filter-change", {
        filterType: this.filterType,
        filterId: deselect ? null : stat.id,
        statName: stat.name
      })
    },

    handleChartClick(_, elements) {
      if (!elements?.length) return
      this.handleStatClick(this.stats[elements[0].index])
    }
  }
}
</script>

<style scoped>
.legend-scroll {
  overflow: hidden;
}

.legend-scroll.scrollable {
  overflow-y: auto;
  padding-right: 4px;
}

.legend-scroll.scrollable::-webkit-scrollbar {
  width: 6px;
}

.legend-scroll.scrollable::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}

.stat-item {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.stat-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.selected-stat {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
