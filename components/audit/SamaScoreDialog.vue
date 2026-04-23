<template>
  <v-card-text>
    <div v-if="loadingSamaScore" class="d-flex justify-center py-6">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <v-alert v-else-if="!samaScore" type="error">
      {{ $t("page.unable_to_load_data") || "Unable to load score data." }}
    </v-alert>

    <div v-else>
      <!-- Summary -->
      <v-card outlined class="pa-4 mb-4">
        <div class="d-flex align-center">
          <div class="flex-grow-1 mr-4">
            <span class="caption">{{ $t("page.overall_maturity") || "Overall Maturity" }}</span>
            <v-progress-linear
              :value="summary.overall_maturity_percentage"
              :color="scoreColor(summary.overall_maturity_percentage)"
              height="20"
              rounded
              class="mt-1"
            >
              <strong class="white--text">{{ summary.overall_maturity_percentage }}%</strong>
            </v-progress-linear>
          </div>
          <div class="text-center mx-4">
            <p class="text-h5 font-weight-bold primary--text mb-0">{{ summary.total_controls }}</p>
            <p class="caption mb-0">{{ $t("page.total_controls") || "Total Controls" }}</p>
          </div>
          <div class="text-center mx-4">
            <p class="text-h5 font-weight-bold primary--text mb-0">{{ summary.considered_controls }}</p>
            <p class="caption mb-0">{{ $t("page.considered_controls") || "Considered Controls" }}</p>
          </div>
          <div class="text-center mx-4">
            <p class="text-h5 font-weight-bold primary--text mb-0">{{ summary.total_score }}</p>
            <p class="caption mb-0">{{ $t("page.total_score") || "Total Score" }}</p>
          </div>
        </div>
      </v-card>

      <!-- Domains Breakdown -->
      <v-row>
        <v-col v-if="domains.length" cols="12">
          <p class="text-h6 font-weight-bold mb-3">{{ $t("page.domains_breakdown") || "Domains Breakdown" }}</p>
        </v-col>

        <v-col v-for="domain in domains" :key="domain.id" cols="12" sm="6">
          <v-card outlined class="pa-4">
            <p class="subtitle-1 font-weight-bold mb-3">{{ domain.name }}</p>

            <div class="d-flex align-center mb-2">
              <span class="caption" style="min-width: 120px">{{ $t("page.maturity") || "Maturity" }}</span>
              <v-progress-linear
                :value="domain.maturity_percentage"
                :color="scoreColor(domain.maturity_percentage)"
                height="20"
                rounded
                class="flex-grow-1"
              >
                <strong class="white--text">{{ domain.maturity_percentage }}%</strong>
              </v-progress-linear>
            </div>

            <v-row dense class="mt-2">
              <v-col cols="4" class="text-center">
                <p class="text-h6 font-weight-bold primary--text mb-0">{{ domain.controls_count }}</p>
                <p class="caption mb-0">{{ $t("page.controls") || "Controls" }}</p>
              </v-col>
              <v-col cols="4" class="text-center">
                <p class="text-h6 font-weight-bold primary--text mb-0">{{ domain.excluded_count }}</p>
                <p class="caption mb-0">{{ $t("page.excluded_controls") || "Excluded" }}</p>
              </v-col>
              <v-col cols="4" class="text-center">
                <p class="text-h6 font-weight-bold primary--text mb-0">{{ domain.total_score }}</p>
                <p class="caption mb-0">{{ $t("page.score") || "Score" }}</p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-card-text>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  name: "SamaScoreDialog",
  props: {
    auditId: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    ...mapGetters("audits", ["samaScore", "loadingSamaScore"]),
    summary() {
      return this.samaScore?.summary || {}
    },
    domains() {
      return this.samaScore?.domains || []
    }
  },
  mounted() {
    this.fetchSamaScore(this.auditId)
  },
  methods: {
    ...mapActions("audits", ["fetchSamaScore"]),
    scoreColor(score) {
      // if (score >= 80) return "#061e37"
      // if (score >= 60) return "#223c57"
      return "#061e37"
    }
  }
}
</script>
