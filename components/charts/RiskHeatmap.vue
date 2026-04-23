# RiskHeatmap.vue
<template>
  <v-card flat class="heatmap-card">
    <div class="mb-4 d-flex align-center">
      <v-btn-toggle v-model="selectedRatingType" mandatory class="mr-4">
        <v-btn small value="inherent">
          {{ $t("table.overall_inherent_risk_rating") }}
        </v-btn>
        <v-btn small value="residual">
          {{ $t("table.overall_residual_risk_rating") }}
        </v-btn>
      </v-btn-toggle>

      <v-btn outlined small @click="$store.dispatch('heatmap/toggleHeatmapDisplay')">
        {{ displayCount ? $t("page.show_sequence") : $t("page.show_counts") }}
      </v-btn>
    </div>
    <div class="d-flex">
      <div class="risk-heatmap-container">
        <!-- Main wrapper grid that includes labels -->
        <div class="heatmap-wrapper">
          <!-- Y-axis title -->
          <div class="y-axis-title">{{ $t("table.likelihood") }}</div>

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
              <div v-if="displayCount && cell.count > 0" class="count-circle" :style="countCircleStyle(cell.count)">
                {{ cell.count }}
              </div>
              <div
                v-else
                v-for="riskId in cell.risks"
                :key="riskId"
                class="risk-circle"
                :style="getRiskCircleStyle(riskId)"
              >
                {{ getListOrder(riskId) }}
              </div>
            </div>
          </div>

          <!-- X-axis labels -->
          <div class="x-labels">
            <div v-for="label in impactLabels" :key="label.id" class="x-label">
              {{ label.name }}
            </div>
          </div>

          <!-- X-axis title -->
          <div class="x-axis-title">{{ $t("table.impact") }}</div>
        </div>
      </div>

      <!-- Risk Criteria Legend -->
      <risk-criteria-legend v-if="displayCount" :priorities="priorities" class="mx-4" />

      <!-- Onset Speed Legend -->
      <v-card v-if="!displayCount" class="onset-legend" flat outlined>
        <div class="subtitle-2 mb-2">{{ $t("form.onset_speed") }}</div>
        <div v-for="speed in sortedOnsetSpeeds" :key="speed.id" class="legend-item">
          <div class="legend-circle" :style="getSpeedStyle(speed)"></div>
          <span :class="`legend-text ${isRTL ? 'mr-2' : 'ml-2'}`">{{ speed.name }}</span>
        </div>
      </v-card>

      <!-- Risk List -->
      <v-card v-if="!displayCount" class="risk-list ml-4" flat outlined>
        <v-list dense>
          <v-list-item-group>
            <v-list-item v-for="(risk, index) in risks" :key="risk.id">
              <v-list-item-content @click="routeTo(risk.id)">
                <v-list-item-title>
                  <span class="font-weight-bold mr-2">{{ index + 1 }}.</span>
                  {{ risk.name }}
                  <v-icon x-small :color="'blue'">mdi-open-in-new</v-icon>
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
import RiskCriteriaLegend from "./RiskCriteriaLegend.vue"

export default {
  name: "RiskHeatmap",
  components: {
    RiskCriteriaLegend
  },
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
    },
    onsetSpeeds: {
      type: Array,
      required: true
    },
    priorities: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(
          (priority) =>
            "name" in priority &&
            "description" in priority &&
            "range_min" in priority &&
            "range_max" in priority &&
            "color" in priority
        )
      }
    }
  },
  data() {
    return {
      selectedRatingType: "inherent"
    }
  },
  computed: {
    ...mapState(["isRTL"]),
    ...mapState("heatmap", ["displayCount"]),

    currentRatingKey() {
      return this.selectedRatingType === "inherent" ? "risk_rating" : "overall_residual_rating"
    },

    sortedOnsetSpeeds() {
      return [...this.onsetSpeeds].sort((a, b) => Number(b.code) - Number(a.code))
    },

    impactLabels() {
      return [...this.impacts].sort((a, b) => Number(a.code) - Number(b.code))
    },

    likelihoodLabels() {
      return [...this.likelihoods].sort((a, b) => Number(b.code) - Number(a.code))
    },

    cellCounts() {
      const counts = Array(5)
        .fill()
        .map(() => Array(5).fill(0))

      this.risks.forEach((risk) => {
        if (!risk[this.currentRatingKey]?.score) return

        const score = risk[this.currentRatingKey].score
        const maxImpact = Math.max(...this.impactLabels.map((i) => Number(i.code)))
        const calculatedImpact = Math.ceil(score / maxImpact) || 1 // Default to 1 if calculation results in 0
        const calculatedLikelihood = Math.ceil(score / calculatedImpact) || 1 // Default to 1 if calculation results in 0

        const impactIndex = this.impactLabels.findIndex((i) => Number(i.code) === calculatedImpact)
        const likelihoodIndex = this.likelihoodLabels.findIndex((l) => Number(l.code) === calculatedLikelihood)

        if (impactIndex !== -1 && likelihoodIndex !== -1) {
          counts[likelihoodIndex][impactIndex]++
        }
      })

      return counts
    },

    gridCells() {
      const cells = []
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          cells.push({
            color: this.getCellColor(i, j),
            count: this.cellCounts[i][j],
            risks: this.getRisksForCell(i, j)
          })
        }
      }
      return cells
    }
  },
  methods: {
    routeTo(id) {
      const url = `/grc/risk-register/${id}`
      this.$router.push(this.localePath(url))
    },
    getListOrder(riskId) {
      return this.risks.findIndex((r) => r.id === riskId) + 1
    },
    getCellColor(likelihoodIndex, impactIndex) {
      const likelihood = this.likelihoodLabels[likelihoodIndex]
      const impact = this.impactLabels[impactIndex]

      if (!likelihood?.code || !impact?.code) return "#FFFFFF"

      const riskScore = Number(likelihood.code) * Number(impact.code)
      const priority = this.priorities.find((p) => riskScore >= p.range_min && riskScore <= p.range_max)

      return priority?.color || "#FFFFFF"
    },

    getRisksForCell(likelihoodIndex, impactIndex) {
      return this.risks
        .filter((risk) => {
          if (!risk[this.currentRatingKey]?.score) return false

          // Calculate the expected position based on the score
          const score = risk[this.currentRatingKey].score
          const maxImpact = Math.max(...this.impactLabels.map((i) => Number(i.code)))
          const calculatedImpact = Math.ceil(score / maxImpact) || 1 // Default to 1 if calculation results in 0
          const calculatedLikelihood = Math.ceil(score / calculatedImpact) || 1 // Default to 1 if calculation results in 0

          // Find the matching indices for these values
          const matchingImpactIndex = this.impactLabels.findIndex((i) => Number(i.code) === calculatedImpact)
          const matchingLikelihoodIndex = this.likelihoodLabels.findIndex(
            (l) => Number(l.code) === calculatedLikelihood
          )

          return matchingLikelihoodIndex === likelihoodIndex && matchingImpactIndex === impactIndex
        })
        .map((risk) => risk.id)
    },

    getSpeedStyle(speed) {
      const maxSize = 44
      const minSize = 28
      const sizeRange = maxSize - minSize
      const maxCode = Math.max(...this.onsetSpeeds.map((s) => Number(s.code)))
      const size = minSize + (Number(speed.code) / maxCode) * sizeRange

      return {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: speed.color,
        borderRadius: "50%"
      }
    },

    getRiskCircleStyle(riskId) {
      const risk = this.risks.find((r) => r.id === riskId)
      if (!risk || !risk.onset_speed) return {}

      const speed = this.onsetSpeeds.find((s) => s.id === risk.onset_speed.id)
      if (!speed) return {}

      const style = this.getSpeedStyle(speed)
      const top = Math.random() * 60
      const left = Math.random() * 60

      return {
        ...style,
        position: "absolute",
        top: `${top}%`,
        left: `${left}%`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: `${12 + Number(speed.code) * 0.8}px`,
        border: "1px solid white"
      }
    },

    countCircleStyle(count) {
      const baseSize = 24
      const maxSize = 60 // Cap at 60px

      // Calculate size with a cap
      let size = baseSize + (count - 1) * ((maxSize - baseSize) / 10) // Adjusted scaling
      size = Math.min(size, maxSize) // Ensure we don't exceed the cap

      // Font size logic with caps and special handling for large numbers
      let fontSize
      if (count <= 9) {
        fontSize = 11 + (count - 1) * 1.5
      } else if (count <= 99) {
        fontSize = Math.max(14, 18 - (count - 10) * 0.1) // Gradually decrease for 2-digit numbers
      } else if (count <= 999) {
        fontSize = Math.max(12, 16 - (count - 100) * 0.01) // Smaller for 3-digit numbers
      } else {
        fontSize = 10 // Very small for 4+ digit numbers
      }

      // Cap the font size
      fontSize = Math.min(fontSize, 18)
      fontSize = Math.max(fontSize, 8) // Minimum readable size

      return {
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${fontSize}px`,
        backgroundColor: `rgba(0, 0, 0, ${Math.min(0.4 + count * 0.02, 0.8)})`, // Cap opacity too
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        border: "1px solid white"
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
  display: flex;
  justify-content: center;
}

.heatmap-wrapper {
  display: grid;
  grid-template-areas:
    "ylabels-title ylabels grid"
    "empty empty xlabels"
    "empty empty xlabels-title";
  grid-template-columns: auto auto 1fr;
  grid-template-rows: auto auto auto;
  gap: 2px;
  width: fit-content;
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
  display: flex;
  align-items: center;
  justify-content: center;
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

.onset-legend {
  margin: 0 16px;
  padding: 16px;
  border-radius: 4px;
  width: 200px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.legend-text {
  font-size: 0.85em;
}

.risk-list {
  width: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.y-axis-title {
  grid-area: ylabels-title;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-weight: bold;
}

.x-axis-title {
  grid-area: xlabels-title;
  text-align: center;
  padding: 8px;
  font-weight: bold;
}
</style>
