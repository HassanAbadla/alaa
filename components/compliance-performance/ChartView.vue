<template>
  <v-container>
    <v-card flat>
      <div class="d-flex align-center justify-space-between">
        <v-card-title>{{ $t("table.compliance_percentage") }}</v-card-title>
        <v-btn small color="primary" class="mx-1" @click="recalculatePerformance" :loading="calculatingPerformance">
          {{ $t("page.recalculate_performance") }}
        </v-btn>
      </div>
      <v-row class="mt-4">
        <v-col v-for="performance in performances" :key="performance.id" cols="12" md="4">
          <v-card flat outlined class="pa-4">
            <v-row>
              <v-col cols="2" class="d-flex align-center">
                <v-img :src="performance.compliancePackage.package_image" contain height="100" width="80"></v-img>
              </v-col>
              <v-col class="d-flex flex-column justify-center align-center">
                <v-card-text>{{ performance.compliancePackage.name }}</v-card-text>
                <v-progress-circular
                  :size="90"
                  :width="15"
                  :color="getComplianceColor(performance.compliance_percentage)"
                  :value="performance.compliance_percentage"
                  disabled
                >
                  <strong>{{ performance.compliance_percentage }}%</strong>
                </v-progress-circular>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex"

export default {
  name: "CompliancePerformanceChartView",
  layout: "dashboard-layout",
  data() {
    return {
      calculatingPerformance: false
    }
  },
  methods: {
    ...mapActions("auditMasterEvidence", ["getPerformance", "setPerformance", "calculatePerformance"]),
    getComplianceColor(percentage) {
      if (percentage >= 85) return "green"
      if (percentage >= 65) return "amber"
      if (percentage >= 35) return "orange"
      return "red"
    },
    async recalculatePerformance() {
      this.calculatingPerformance = true
      await this.calculatePerformance()
      this.calculatingPerformance = false
    }
  },
  async mounted() {
    await this.getPerformance()
    this.calculatePerformance()
  },
  computed: {
    ...mapState("auditMasterEvidence", ["performances"])
  }
}
</script>
