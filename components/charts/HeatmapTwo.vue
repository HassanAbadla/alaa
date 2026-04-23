<template>
  <v-card flat class="heatmap-card">
    <div class="d-flex">
      <!-- Main Heatmap -->
      <div class="risk-heatmap-container">
        <div class="heatmap-wrapper">
          <!-- Y-axis labels -->
          <div class="y-labels">
            <div v-for="label in likelihoodLabels" :key="label.id" :class="`y-label ${isRTL ? 'pl-2' : 'pr-2'}`">
              {{ label.name }}
            </div>
          </div>

          <!-- Main grid -->
          <div class="grid-container">
            <div
              v-for="(cell, index) in gridCells"
              :key="index"
              class="grid-cell"
              :style="{ backgroundColor: cell.color }"
            >
              <div
                v-for="riskId in cell.risks"
                :key="riskId"
                class="risk-circle"
                :class="getSpeedClass(riskId)"
                :style="getCircleStyle(riskId)"
              >
                {{ riskId }}
              </div>
            </div>
          </div>

          <!-- X-axis labels -->
          <div class="x-labels">
            <div v-for="label in impactLabels" :key="label.id" class="x-label">
              {{ label.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Risk List -->
      <v-card class="risk-list ml-4" flat outlined>
        <v-list dense>
          <v-list-item-group>
            <v-list-item v-for="risk in risks" :key="risk.id">
              <v-list-item-content>
                <v-list-item-title>
                  <span class="font-weight-bold mr-2">{{ risk.id }}.</span>
                  {{ risk.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import { mapState } from "vuex"
import heatmapHandler from "../../mixins/heatmapHandler"

export default {
  name: "RiskHeatmapV2",
  mixins: [heatmapHandler],
  props: {
    risks: {
      type: Array,
      required: true
    },
    impacts: {
      type: Array,
      required: true
    },
    likelihoods: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      colorMatrix: [
        // Almost Certain (highest probability)
        ["#92D050", "#FFEB84", "#FFC000", "#FF0000", "#FF0000"],
        // Very Likely
        ["#92D050", "#FFEB84", "#FFC000", "#FFC000", "#FF0000"],
        // Likely
        ["#92D050", "#92D050", "#FFEB84", "#FFC000", "#FF0000"],
        // Possible
        ["#92D050", "#92D050", "#FFEB84", "#FFEB84", "#FFC000"],
        // Unlikely (lowest probability)
        ["#92D050", "#92D050", "#92D050", "#FFEB84", "#FFEB84"]
      ],
      // Mock speed of onset data - this would come from your API in real implementation
      speedOfOnset: {
        1: "low",
        2: "medium",
        3: "high"
      }
    }
  },
  computed: {
    ...mapState(["isRTL"]),

    gridCells() {
      // Initialize 5x5 matrix with colors and empty risk arrays
      const cells = []
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          cells.push({
            color: this.colorMatrix[i][j],
            risks: this.getRisksForCell(i, j)
          })
        }
      }
      return cells
    }
  },
  methods: {
    getRisksForCell(likelihoodIndex, impactIndex) {
      // Filter risks that belong in this cell based on their impact and likelihood
      return this.risks
        .filter((risk) => {
          const riskLikelihoodIndex = this.likelihoodLabels.findIndex((l) => l.id === risk.likely_hood.id)
          const riskImpactIndex = this.impactLabels.findIndex((i) => i.id === risk.impact.id)
          return riskLikelihoodIndex === likelihoodIndex && riskImpactIndex === impactIndex
        })
        .map((risk) => risk.id)
    },
    getSpeedClass(riskId) {
      // Get mock speed of onset - in real implementation, this would come from your risk data
      const speed = this.speedOfOnset[(riskId % 3) + 1]
      return `speed-${speed}`
    },
    getCircleStyle(riskId) {
      // Random positioning within the cell
      const top = Math.random() * 60 + 10 // 10-70% from top
      const left = Math.random() * 60 + 10 // 10-70% from left
      return {
        top: `${top}%`,
        left: `${left}%`
      }
    }
  }
}
</script>

<style scoped>
.heatmap-card {
  padding: 16px;
}

.risk-heatmap-container {
  /* flex: 1; */
}

.heatmap-wrapper {
  display: grid;
  grid-template-areas:
    "ylabels grid"
    "empty xlabels";
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 2px;
}

.y-labels {
  grid-area: ylabels;
  display: grid;
  grid-template-rows: repeat(5, 80px);
  gap: 2px;
}

.y-label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.85em;
}

.grid-container {
  grid-area: grid;
  display: grid;
  grid-template-columns: repeat(5, 80px);
  grid-template-rows: repeat(5, 80px);
  gap: 2px;
  background-color: #ffffff;
  border: 1px solid #ddd;
}

.grid-cell {
  position: relative;
  min-height: 80px;
}

.x-labels {
  grid-area: xlabels;
  display: grid;
  grid-template-columns: repeat(5, 80px);
  gap: 2px;
  padding-top: 8px;
}

.x-label {
  text-align: center;
  font-size: 0.85em;
}

.risk-circle {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.speed-low {
  width: 24px;
  height: 24px;
  font-size: 12px;
}

.speed-medium {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.speed-high {
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.risk-list {
  width: 300px;
  max-height: 500px;
  overflow-y: auto;
}
</style>
