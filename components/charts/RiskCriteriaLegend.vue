<template>
  <v-card flat class="risk-criteria-legend">
    <v-card-title class="text-subtitle-1 font-weight-bold pb-2">
      {{ $t("page.risk_severity_criteria") }}
    </v-card-title>
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">{{ $t("table.level") }}</th>
            <th class="text-left">{{ $t("table.range") }}</th>
            <th class="text-left">{{ $t("table.description") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="priority in priorities" :key="priority.name">
            <td
              class="font-weight-medium"
              :style="{ backgroundColor: getPriorityColor(priority), color: getPriorityTextColor(priority) }"
            >
              {{ priority.name }}
            </td>
            <td :style="{ backgroundColor: getPriorityColor(priority), color: getPriorityTextColor(priority) }">
              {{ formatRange(priority) }}
            </td>
            <td :style="{ backgroundColor: getPriorityColor(priority), color: getPriorityTextColor(priority) }">
              {{ priority.description }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
export default {
  name: "RiskCriteriaLegend",
  props: {
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
  methods: {
    formatRange(priority) {
      return `${priority.range_min}-${priority.range_max}`
    },
    getPriorityColor(priority) {
      return priority.color || "#FFFFFF"
    },
    getPriorityTextColor(priority) {
      // Return white text for dark backgrounds, black for light backgrounds
      const darkBackgrounds = ["5", "4"]
      return darkBackgrounds.includes(priority.code) ? "#FFFFFF" : "#000000"
    }
  }
}
</script>

<style scoped>
.risk-criteria-legend {
  min-width: 600px;
  max-width: 800px;
}

.v-data-table ::v-deep tbody tr td {
  padding: 8px 16px !important;
}

.v-data-table ::v-deep tbody tr td:first-child {
  width: 120px;
  text-align: center;
}

.v-data-table ::v-deep tbody tr td:nth-child(2) {
  width: 100px;
}
</style>
