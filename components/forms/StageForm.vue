<template>
  <form-wrapper :submitText="$t('form.save')" :loading="isLoading" @submit="handleSubmit">
    <custom-date-picker
      v-model="formFields.start_date"
      :label="$t('form.start_date')"
      :errors="fieldErrors.start_date"
      @clear-errors="clearFieldErrors('start_date')"
      :required="formFields.is_started"
      :disabled="!formFields.is_started"
    />
    <custom-date-picker
      v-model="formFields.end_date"
      :label="$t('form.end_date')"
      isEndDate
      :startDate="formFields.start_date"
      :errors="fieldErrors.end_date"
      @clear-errors="clearFieldErrors('end_date')"
      :required="formFields.is_completed"
      :disabled="!formFields.is_completed"
    />
    <custom-date-picker
      v-model="formFields.estimate_start_date"
      :label="$t('form.estimate_start_date')"
      :errors="fieldErrors.estimate_start_date"
      @clear-errors="clearFieldErrors('estimate_start_date')"
      required
    />
    <custom-date-picker
      v-model="formFields.estimate_end_date"
      :label="$t('form.estimate_end_date')"
      isEndDate
      :startDate="formFields.estimate_start_date"
      :errors="fieldErrors.estimate_end_date"
      @clear-errors="clearFieldErrors('estimate_end_date')"
      required
    />
    <v-switch
      v-model="formFields.is_started"
      :label="$t('form.is_started')"
      class="date_picker"
      :error-messages="fieldErrors.is_started"
      @focus="clearFieldErrors('is_started')"
      @change="handleIsStartedChange"
    />
    <v-switch
      v-model="formFields.is_completed"
      :label="$t('form.is_completed')"
      class="date_picker"
      :error-messages="fieldErrors.is_completed"
      @focus="clearFieldErrors('is_completed')"
      @change="handleIsCompletedChange"
    />
    <v-switch
      v-model="formFields.active"
      :label="$t('form.active')"
      class="date_picker"
      :error-messages="fieldErrors.active"
      @focus="clearFieldErrors('active')"
    />
  </form-wrapper>
</template>
<script>
import { mapActions, mapState } from "vuex"
import CustomDatePicker from "@/components/custom-form/CustomDatePicker.vue"
import FormWrapper from "@/components/custom-form/FormWrapper.vue"

export default {
  name: "StageForm",
  components: { CustomDatePicker, FormWrapper },
  props: {
    stage: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isLoading: false,
      formFields: this.initializeFormFields(),
      fieldErrors: {
        start_date: [],
        end_date: [],
        estimate_start_date: [],
        estimate_end_date: [],
        is_started: [],
        is_completed: [],
        active: []
      }
    }
  },
  computed: {
    formTitle() {
      return this.stage?.stage?.title || this.$t("form.stage")
    }
  },
  watch: {
    stage: {
      handler(newStage) {
        this.formFields = this.initializeFormFields(newStage)
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions("manageChecklists", ["saveStage"]),
    initializeFormFields(stage) {
      stage = stage || {}
      return {
        start_date: stage.start_date || "",
        end_date: stage.end_date || "",
        estimate_start_date: stage.estimate_start_date || "",
        estimate_end_date: stage.estimate_end_date || "",
        is_started: stage.is_started || false,
        is_completed: stage.is_completed || false,
        active: stage.active || false
      }
    },
    async handleSubmit() {
      this.isLoading = true
      try {
        const payload = {
          ...this.formFields,
          contract_id: this.$route.params.contract_id,
          project_id: this.$route.params.id,
          project_stage: this.stage.id
        }
        await this.saveStage(payload)
        // await this.$store.dispatch("projectStages/saveStage", payload)
        this.$emit("saved")
      } catch (error) {
        console.error("Error saving stage:", error)
        this.handleApiErrors(error)
      } finally {
        this.isLoading = false
      }
    },
    handleApiErrors(error) {
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors
        for (const field in this.fieldErrors) {
          if (apiErrors[field]) {
            this.$set(this.fieldErrors, field, Array.isArray(apiErrors[field]) ? apiErrors[field] : [apiErrors[field]])
          } else {
            this.$set(this.fieldErrors, field, [])
          }
        }
      } else {
        console.error("Unexpected error structure:", error)
      }
    },
    clearFieldErrors(field) {
      if (this.fieldErrors.hasOwnProperty(field)) {
        this.$set(this.fieldErrors, field, [])
      }
    },
    handleIsStartedChange(value) {
      if (value) {
        this.formFields.start_date = this.getCurrentDate()
      } else {
        this.formFields.start_date = ""
      }
    },
    handleIsCompletedChange(value) {
      if (value) {
        this.formFields.end_date = this.getCurrentDate()
      } else {
        this.formFields.end_date = ""
      }
    },
    getCurrentDate() {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const day = String(today.getDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    }
  }
}
</script>
