<template>
  <v-container>
    <v-form ref="form" v-model="valid">
      <custom-dropdown
        v-model="form.srv_contract_id"
        :items="getContracts"
        :required="true"
        item-value="id"
        item-text="name"
        :label="$t('form.contract')"
        :rules="[rules.required]"
        :loading="loadingContracts"
        :disabled="!editForm && this.$route.query.srv_contract_id ? true : false"
      />
      <custom-dropdown
        v-model="form.srv_frequency_id"
        :items="getFrequencies"
        :required="true"
        item-text="name"
        item-value="id"
        :label="$t('table.frequency')"
        :rules="[rules.required]"
        :loading="loadingFrequencies"
      />
      <custom-dropdown
        v-model="form.srv_visits_prioriy_id"
        :items="getVisitPriorities"
        :required="true"
        item-text="name"
        item-value="id"
        :label="$t('table.priority')"
        :rules="[rules.required]"
        :loading="loadingVisitPriorites"
      />
      <custom-dropdown
        v-model="form.srv_team_id"
        :items="getTeams"
        item-text="name"
        item-value="id"
        :label="$t('table.team')"
        :rules="[rules.required]"
        :loading="loadingTeams"
      />

      <custom-date-picker
        v-model="form.first_visit_date"
        :label="$t('table.first_visit_date_optional')"
        :required="false"
      />
    </v-form>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        outlined
        @click="previewVisits"
        :disabled="!valid || loading.preview"
        :loading="loading.preview"
      >
        <v-icon left>mdi-eye</v-icon>
        {{ $t("action.preview_visits") }}
      </v-btn>
    </v-card-actions>

    <!-- Preview Dialog -->
    <v-dialog v-model="previewDialog" max-width="900" scrollable>
      <v-card v-if="preview">
        <v-card-title class="headline primary white--text">
          <v-icon class="mx-1" color="white">mdi-calendar-multiple</v-icon>
          {{ $t("action.preview_visits") }}
          <v-spacer></v-spacer>
          <v-btn icon dark @click="previewDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-row>
            <v-col cols="12">
              <v-alert type="success" prominent text border="left">
                <v-row align="center">
                  <v-col class="grow">
                    <div class="text-h5 mb-2">
                      {{ $t("page.visits_will_be_generated", { count: preview.total_visits }) }}
                    </div>
                    <div>
                      <strong>{{ $t("table.contract") }}:</strong>
                      {{ preview.contract_name }}
                    </div>
                    <div>
                      <strong>{{ $t("table.frequency") }}:</strong>
                      {{ preview.frequency }}
                    </div>
                    <div>
                      <strong>{{ $t("table.period") }}:</strong>
                      {{
                        $t("page.period_range", {
                          start: formatDate(preview.start_date).date,
                          end: formatDate(preview.end_date).date
                        })
                      }}
                    </div>
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-card outlined>
                <v-card-subtitle class="pb-0">
                  <strong>{{ $t("page.scheduled_visits_dates") }}</strong>
                </v-card-subtitle>
                <v-card-text>
                  <v-chip-group column>
                    <v-chip v-for="(date, index) in preview.visit_dates" :key="index" color="primary" outlined label>
                      <v-icon left small>mdi-calendar-check</v-icon>
                      {{ $t("table.visit") }} #{{ index + 1 }}: {{ formatedDate(date) }}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn text @click="previewDialog = false">{{ $t("action.cancel") }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="generateVisits" :loading="loading.generate" :disabled="loading.generate">
            <v-icon left>mdi-check-circle</v-icon>
            {{ $t("action.confirm_and_generate_visits") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <!-- <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" top right>
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar> -->
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { formatDate } from "@/helpers/misc"
export default {
  name: "GenerateScheduledVisits",
  props: {
    onVisitsGenerated: {
      type: Function,
      default: null
    }
  },

  data() {
    return {
      valid: false,
      dateMenu: false,
      previewDialog: false,

      form: {
        srv_contract_id: Number(this.$route.query.srv_contract_id) || null,
        srv_frequency_id: null,
        srv_team_id: null,
        srv_visits_prioriy_id: null,
        first_visit_date: null
      },

      contracts: [],
      frequencies: [],
      teams: [],
      priorities: [],
      preview: null,

      loading: {
        contracts: false,
        frequencies: false,
        teams: false,
        priorities: false,
        preview: false,
        generate: false
      },

      snackbar: {
        show: false,
        text: "",
        color: "success",
        timeout: 3000
      },

      rules: {
        required: (v) => !!v || "This field is required"
      }
    }
  },

  computed: {
    ...mapGetters({
      getCurrentVisit: "srvVisits/getCurrentVisit",
      loadingVisits: "srvVisits/isLoading",
      getContracts: "srvContracts/getContracts",
      loadingContracts: "srvContracts/isLoading",
      getTeams: "srvTeams/getTeams",
      loadingTeams: "srvTeams/isLoading",
      getVisitPriorities: "srvVisitPriorities/getVisitPriorities",
      loadingVisitPriorites: "srvVisitPriorities/isLoading",
      getVisitStatuses: "srvVisitStatuses/getVisitStatuses",
      loadingVisitStatuses: "srvVisitStatuses/isLoading",
      getFrequencies: "srvFrequencies/getFrequencies",
      loadingFrequencies: "srvFrequencies/isLoading"
    }),
    selectedContract() {
      if (!this.form.srv_contract_id) return null
      return this.contracts.find((c) => c.id === this.form.srv_contract_id)
    }
  },

  mounted() {
    this.loadDropdowns()
  },

  methods: {
    ...mapActions({
      addVisit: "srvVisits/addVisit",
      updateVisit: "srvVisits/updateVisit",
      fetchVisitById: "srvVisits/fetchVisitById",
      fetchContracts: "srvContracts/fetchContracts",
      fetchFrequencies: "srvFrequencies/fetchFrequencies",
      fetchTeams: "srvTeams/fetchTeams",
      fetchVisitPriorities: "srvVisitPriorities/fetchVisitPriorities",
      fetchVisitStatuses: "srvVisitStatuses/fetchVisitStatuses"
    }),
    formatDate,
    async loadDropdowns() {
      await Promise.all([
        this.fetchContracts(),
        this.fetchFrequencies(),
        this.fetchTeams(),
        this.fetchVisitPriorities()
      ])
    },

    onContractChange() {
      // Reset first visit date when contract changes
      this.form.first_visit_date = null
    },

    async previewVisits() {
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading.preview = true
      try {
        const response = await this.$axios.post("/srv-visits/preview-scheduled", {
          srv_contract_id: this.form.srv_contract_id,
          srv_frequency_id: this.form.srv_frequency_id,
          first_visit_date: this.form.first_visit_date || null
        })

        this.preview = response.data.data
        this.previewDialog = true
      } catch (error) {
        this.showSnackbar("Error previewing visits", "error")
        console.error(error)
      } finally {
        this.loading.preview = false
      }
    },

    async generateVisits() {
      this.loading.generate = true
      try {
        const response = await this.$axios.post("/srv-visits/generate-scheduled", this.form)

        this.showSnackbar(`Success! ${response.data.count} visits generated`, "success")

        this.previewDialog = false
        this.resetForm()

        // Emit event to parent component if needed
        this.$emit("visits-generated", response.data.data)
        if (this.onVisitsGenerated) {
          this.onVisitsGenerated(response.data.data)
        }
      } catch (error) {
        this.showSnackbar("Error generating visits", "error")
        console.error(error)
      } finally {
        this.loading.generate = false
      }
    },

    resetForm() {
      this.$refs.form.reset()
      this.form = {
        srv_contract_id: null,
        srv_frequency_id: null,
        srv_team_id: null,
        srv_visits_prioriy_id: null,
        first_visit_date: null
      }
      this.preview = null
    },

    calculateContractDuration() {
      if (!this.selectedContract) return 0
      const start = new Date(this.selectedContract.date_contract_starts)
      const end = new Date(this.selectedContract.date_contract_ends)
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      return diff
    },

    formatedDate(date) {
      const options = { year: "numeric", month: "short", day: "numeric" }
      return new Date(date).toLocaleDateString("en-US", options)
    },

    getPriorityColor(code) {
      const colors = {
        high: "red",
        medium: "orange",
        low: "green",
        urgent: "deep-purple"
      }
      return colors[code] || "grey"
    },

    showSnackbar(text, color = "success") {
      this.snackbar.text = text
      this.snackbar.color = color
      this.snackbar.show = true
    }
  }
}
</script>

<style scoped>
.headline {
  font-weight: 500;
}
</style>
