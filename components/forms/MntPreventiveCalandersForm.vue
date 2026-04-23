<template>
  <div class="mnt-preventive-calander-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :title="title" :loading="isSubmitting" @submit="handleSubmit">
      <custom-input
        v-model="fields.code"
        :label="$t('form.code') || 'Code'"
        :required="true"
        :errors="errors.code"
        @clear-errors="clearError('code')"
      />
      <custom-input
        v-model="fields.name.en"
        :label="$t('form.name_en') || 'Name (English)'"
        :required="true"
        :errors="errors['name.en']"
        @clear-errors="clearError('name.en')"
      />
      <custom-input
        v-model="fields.name.ar"
        :label="$t('form.name_ar') || 'Name (Arabic)'"
        :errors="errors['name.ar']"
        @clear-errors="clearError('name.ar')"
      />
      <v-autocomplete
        v-model="fields.mnt_schedule_id"
        :items="schedules"
        item-text="name"
        item-value="id"
        :label="$t('form.mnt_schedule_id') || 'Schedule'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <v-autocomplete
        v-model="fields.mnt_preventive_logs_id"
        :items="preventiveLogs"
        item-text="name"
        item-value="id"
        :label="$t('form.mnt_preventive_logs_id') || 'Preventive Log'"
        clearable
        outlined
        dense
        class="mb-2"
      />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "MntPreventiveCalandersForm",
  props: {
    editForm: { type: Boolean, default: false },
    itemId: { type: [Number, String], default: null }
  },
  data() {
    return {
      fields: {
        code: "",
        name: { en: "", ar: "" },
        mnt_schedule_id: null,
        mnt_preventive_logs_id: null,
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      preventiveCalanders: "mntPreventiveCalanders/getPreventiveCalanders",
      currentPreventiveCalander: "mntPreventiveCalanders/getCurrentPreventiveCalander",
      schedules: "mntSchedules/getSchedules",
      preventiveLogs: "mntPreventiveLogs/getPreventiveLogs"
    }),
    title() {
      return `${this.editForm ? 'Edit' : 'Create'} Preventive Calendar`
    }
  },
  methods: {
    ...mapActions({
      addPreventiveCalander: "mntPreventiveCalanders/addPreventiveCalander",
      updatePreventiveCalander: "mntPreventiveCalanders/updatePreventiveCalander",
      fetchPreventiveCalanderById: "mntPreventiveCalanders/fetchPreventiveCalanderById",
      fetchSchedules: "mntSchedules/fetchSchedules",
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    clearError(field) {
      if (this.errors[field]) {
        this.$set(this.errors, field, [])
      }
    },
    async handleSubmit() {
      this.isSubmitting = true
      this.errors = {}
      try {
        const payload = {
          code: this.fields.code,
          name: this.fields.name,
          mnt_schedule_id: this.fields.mnt_schedule_id,
          mnt_preventive_logs_id: this.fields.mnt_preventive_logs_id,
        }

        const result = this.editForm
          ? await this.updatePreventiveCalander({ ...payload, id: this.itemId })
          : await this.addPreventiveCalander(payload)

        if (result?.success === false && result?.errors) {
          this.errors = result.errors
          return
        }

        this.closeDrawer()
      } catch (error) {
        const apiErrors = error?.response?.data?.message || error?.response?.data?.errors
        if (apiErrors && typeof apiErrors === "object") {
          this.errors = apiErrors
        }
        console.error("Error saving Preventive Calendar:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadPreventiveCalander() {
      this.isLoading = true
      try {
        let preventiveCalander = this.preventiveCalanders?.find((c) => c.id === this.itemId)
        if (!preventiveCalander) {
          preventiveCalander = await this.fetchPreventiveCalanderById(this.itemId)
        } else {
          await this.fetchPreventiveCalanderById(this.itemId)
        }

        const source = preventiveCalander || this.currentPreventiveCalander
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            mnt_schedule_id: source.mnt_schedule_id || null,
            mnt_preventive_logs_id: source.mnt_preventive_logs_id || null,
          }
        }
      } catch (error) {
        console.error("Error loading Preventive Calendar:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    this.fetchSchedules()
    if (this.editForm && this.itemId) {
      await this.loadPreventiveCalander()
    }
  }
}
</script>

<style scoped>
.mnt-preventive-calander-form { width: 100%; }
</style>
