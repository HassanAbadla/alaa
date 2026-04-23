<template>
  <v-container class="py-8">
    <custom-dropdown
      v-model="formData.compliance_package_id"
      :items="compliancePackages"
      item-text="name"
      item-value="id"
      :label="$t('form.compliance_package')"
      :required="true"
      :loading="loadingLookups"
    />
    <custom-input v-model="formData.process_name" :label="$t('form.process_name')" :required="true" />
    <custom-input v-model="formData.expected_results" :label="$t('form.expected_results')" :required="true" />
    <custom-date-picker v-model="formData.start_date" :label="$t('form.start_date')" :required="true" />
    <custom-date-picker v-model="formData.end_date" :label="$t('form.end_date')" :required="true" />

    <!-- Periodic Review Section -->
    <v-card v-if="!editForm" class="mt-2 mb-4 pa-4" dense outlined>
      <v-card-text small class="pb-4" dense>
        {{ $t("form.periodic_review_settings") }}
      </v-card-text>

      <v-card-text class="" dense>
        <v-form ref="periodicForm" v-model="periodicFormValid" dense>
          <v-row align="center" class="d-flex align-center" dense>
            <v-col cols="5" dense>
              <v-radio-group v-model="selectedPeriod" :mandatory="false" hide-details class="pb-6" dense>
                <custom-radio :label="$t('form.yearly')" value="yearly" color="primary" dense></custom-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="4" dense>
              <custom-input
                v-model="periodicData.no_of_years"
                type="number"
                :label="$t('form.number_of_years')"
                min="1"
                :disabled="selectedPeriod !== 'yearly'"
                :rules="selectedPeriod === 'yearly' ? numberRules : []"
                outlined
                dense
                class="mt-2"
              ></custom-input>
            </v-col>
          </v-row>

          <!-- Monthly Option -->
          <v-row align="center" class="" dense>
            <v-col cols="5" dense>
              <v-radio-group v-model="selectedPeriod" :mandatory="false" hide-details class="pb-6" dense>
                <custom-radio :label="$t('form.monthly')" value="monthly" color="primary" dense></custom-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="4" dense>
              <custom-input
                v-model="periodicData.no_of_months"
                type="number"
                :label="$t('form.number_of_months')"
                min="1"
                :disabled="selectedPeriod !== 'monthly'"
                :rules="selectedPeriod === 'monthly' ? numberRules : []"
                outlined
                dense
                class="mt-2"
              ></custom-input>
            </v-col>
          </v-row>

          <!-- Weekly Option -->
          <v-row align="center" class="" dense>
            <v-col cols="5" dense>
              <v-radio-group v-model="selectedPeriod" :mandatory="false" hide-details class="pb-6" dense>
                <custom-radio :label="$t('form.weekly')" value="weekly" color="primary" dense></custom-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="4" dense>
              <custom-input
                v-model="periodicData.no_of_weeks"
                type="number"
                :label="$t('form.number_of_weeks')"
                min="1"
                :disabled="selectedPeriod !== 'weekly'"
                :rules="selectedPeriod === 'weekly' ? numberRules : []"
                outlined
                dense
                class="mt-2"
              ></custom-input>
            </v-col>
          </v-row>

          <!-- Daily Option -->
          <v-row align="center" class="-ma-8" dense>
            <v-col cols="5" dense>
              <v-radio-group v-model="selectedPeriod" :mandatory="false" hide-details class="pb-6" dense>
                <custom-radio :label="$t('form.daily')" value="daily" color="primary" dense></custom-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="4" dense>
              <custom-input
                v-model="periodicData.no_of_days"
                type="number"
                :label="$t('form.number_of_days')"
                min="1"
                :disabled="selectedPeriod !== 'daily'"
                :rules="selectedPeriod === 'daily' ? numberRules : []"
                outlined
                dense
                class="mt-2"
              ></custom-input>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <custom-TextArea v-model="formData.description" :label="$t('form.description')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block class="mt-6">
      {{ editForm ? $t("page.update") : $t("form.add") }}
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import CustomDatePicker from "@/components/custom-form/CustomDatePicker.vue"
// import subscriptions-api.js
import { getAllSubcriptions } from "@/api/subscriptions-api"

export default {
  name: "RVPReviewPlansForm",
  components: { CustomDatePicker },
  props: {
    itemPath: {
      type: String,
      required: true
    },
    itemId: {
      type: [Number, String],
      required: true
    },
    editForm: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formData: {
        compliance_package_id: null,
        expected_results: "",
        process_name: "",
        description: "",
        start_date: null,
        end_date: null
      },
      loading: false,
      compliancePackages: [],

      // Periodic Review Data
      periodicFormValid: false,
      selectedPeriod: null,
      periodicData: {
        no_of_years: null,
        no_of_months: null,
        no_of_weeks: null,
        no_of_days: null
      },

      numberRules: [
        (v) => !!v || this.$t("validation.required"),
        (v) => (v && v > 0) || this.$t("validation.greater_than_zero"),
        (v) => (v && Number.isInteger(Number(v))) || this.$t("validation.whole_number")
      ]
    }
  },

  computed: {
    ...mapGetters({
      getPlans: "rvpReviewPlans/getPlans",
      getCurrentPlan: "rvpReviewPlans/getCurrentPlan",
      loadingPlans: "rvpReviewPlans/isLoading"
    }),
    unit() {
      return this.$auth.user.UserUnitPosition[0]?.position?.unit
    }
  },

  watch: {
    selectedPeriod(newPeriod, oldPeriod) {
      // Clear the number input when switching periods
      if (oldPeriod) {
        this.periodicData[
          `no_of_${
            oldPeriod === "yearly"
              ? "years"
              : oldPeriod === "monthly"
              ? "months"
              : oldPeriod === "weekly"
              ? "weeks"
              : "days"
          }`
        ] = null
      }
    }
  },

  methods: {
    ...mapActions({
      addPlan: "rvpReviewPlans/addPlan",
      fetchPlans: "rvpReviewPlans/fetchPlans",
      updatePlan: "rvpReviewPlans/updatePlan",
      fetchPlanById: "rvpReviewPlans/fetchPlanById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),

    getPeriodicReviewData() {
      // Format periodic review data to match Laravel table structure
      return {
        yearly: this.selectedPeriod === "yearly",
        monthly: this.selectedPeriod === "monthly",
        weekly: this.selectedPeriod === "weekly",
        daily: this.selectedPeriod === "daily",
        no_of_years: this.selectedPeriod === "yearly" ? parseInt(this.periodicData.no_of_years) : null,
        no_of_months: this.selectedPeriod === "monthly" ? parseInt(this.periodicData.no_of_months) : null,
        no_of_weeks: this.selectedPeriod === "weekly" ? parseInt(this.periodicData.no_of_weeks) : null,
        no_of_days: this.selectedPeriod === "daily" ? parseInt(this.periodicData.no_of_days) : null
      }
    },

    populatePeriodicReviewData(data) {
      // Populate periodic review form with existing data (for editing)
      if (data.yearly) {
        this.selectedPeriod = "yearly"
        this.periodicData.no_of_years = data.no_of_years
      } else if (data.monthly) {
        this.selectedPeriod = "monthly"
        this.periodicData.no_of_months = data.no_of_months
      } else if (data.weekly) {
        this.selectedPeriod = "weekly"
        this.periodicData.no_of_weeks = data.no_of_weeks
      } else if (data.daily) {
        this.selectedPeriod = "daily"
        this.periodicData.no_of_days = data.no_of_days
      }
    },

    async handleSubmit() {
      // Validate periodic review form if a period is selected
      if (this.selectedPeriod && !this.$refs.periodicForm.validate()) {
        this.$toast.error(this.$t("validation.periodic_review_invalid"))
        return
      }

      this.formData.unit_id = this.unit.id

      // Add periodic review data to formData
      const periodicReviewData = this.getPeriodicReviewData()
      const submitData = {
        ...this.formData,
        ...periodicReviewData
      }

      this.loading = true

      try {
        if (this.editForm) {
          submitData.id = this.itemId
          await this.updatePlan(submitData)
        } else {
          await this.addPlan(submitData)
        }
        this.closeDrawer()
      } catch (error) {
        console.error("Error submitting form:", error)
        this.$toast.error(this.$t("errors.submit_failed"))
      } finally {
        this.loading = false
      }
    }
  },

  async mounted() {
    const response = await getAllSubcriptions(this.$axios)
    this.compliancePackages = response.data.data.map((pkg) => ({ name: pkg.name, id: pkg.id }))

    if (this.editForm) {
      await this.fetchPlanById(this.itemId)
      const currentPlan = this.getCurrentPlan // Fixed: was getCurrentStatus

      // Populate main form data
      this.formData.expected_results = currentPlan.expected_results
      this.formData.process_name = currentPlan.process_name
      this.formData.description = currentPlan.description
      this.formData.start_date = currentPlan.start_date
      this.formData.end_date = currentPlan.end_date
      this.formData.compliance_package_id = currentPlan.compliance_package_id

      // Populate periodic review data if it exists
      this.populatePeriodicReviewData(currentPlan)
    }
  }
}
</script>

<style scoped>
.color_field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  margin-bottom: 1.8rem;
  border: 1px solid #929292;
  border-radius: 4px;
}

.v-radio-group {
  margin-top: 0;
  padding-top: 0;
}

.v-input--radio-group__input {
  margin-top: 0;
}
</style>
