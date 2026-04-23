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
    <custom-TextArea v-model="formData.description" :label="$t('form.description')" :required="false" />
    <v-btn @click="handleSubmit" :loading="loading" color="primary" block>
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
      compliancePackages: []
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

  methods: {
    ...mapActions({
      addPlan: "rvpReviewPlans/addPlan",
      fetchPlans: "rvpReviewPlans/fetchPlans",
      updatePlan: "rvpReviewPlans/updatePlan",
      fetchPlanById: "rvpReviewPlans/fetchPlanById"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    async handleSubmit() {
      // const computedCode = this.formData.name.en.slice(0, 3).toLowerCase()
      // this.formData.code = computedCode
      this.formData.unit_id = this.unit.id
      this.loadingStatus = true
      if (this.editForm) {
        this.formData.id = this.itemId
        await this.updatePlan(this.formData)
        // this.fetchStatuses()
      } else {
        await this.addPlan(this.formData)
        // this.fetchStatuses()
      }
      this.loadingStatus = false
      this.closeDrawer()
    }
  },
  async mounted() {
    const response = await getAllSubcriptions(this.$axios)
    this.compliancePackages = response.data.data.map((pkg) => ({ name: pkg.name, id: pkg.id }))
    if (this.editForm) {
      await this.fetchPlanById(this.itemId)
      this.formData.expected_results = this.getCurrentStatus.expected_results
      this.formData.process_name = this.getCurrentStatus.process_name
      this.formData.description = this.getCurrentStatus.description
      this.formData.start_date = this.getCurrentStatus.start_date
      this.formData.end_date = this.getCurrentStatus.end_date
      this.formData.compliance_package_id = this.getCurrentStatus.compliance_package_id
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
</style>
