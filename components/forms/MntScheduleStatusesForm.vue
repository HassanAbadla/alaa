<template>
  <div class="mnt-schedule-status-form">
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
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "MntScheduleStatusesForm",
  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    itemId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      fields: {
        code: "",
        name: { en: "", ar: "" },
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      scheduleStatuses: "mntScheduleStatuses/getScheduleStatuses",
      currentScheduleStatus: "mntScheduleStatuses/getCurrentScheduleStatus"
    }),
    title() {
      return `${this.editForm ? 'Edit' : 'Create'} Schedule Status`
    }
  },
  methods: {
    ...mapActions({
      addScheduleStatus: "mntScheduleStatuses/addScheduleStatus",
      updateScheduleStatus: "mntScheduleStatuses/updateScheduleStatus",
      fetchScheduleStatusById: "mntScheduleStatuses/fetchScheduleStatusById"
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
        }

        const result = this.editForm
          ? await this.updateScheduleStatus({ ...payload, id: this.itemId })
          : await this.addScheduleStatus(payload)

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
        console.error("Error saving Schedule Status:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadScheduleStatus() {
      this.isLoading = true
      try {
        let scheduleStatus = this.scheduleStatuses?.find((c) => c.id === this.itemId)
        if (!scheduleStatus) {
          scheduleStatus = await this.fetchScheduleStatusById(this.itemId)
        } else {
          await this.fetchScheduleStatusById(this.itemId)
        }

        const source = scheduleStatus || this.currentScheduleStatus
        if (source) {
          this.fields = {
            code: source.code || "",
            name: {
              en: source.name?.en || "",
              ar: source.name?.ar || ""
            },
          }
        }
      } catch (error) {
        console.error("Error loading Schedule Status:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    if (this.editForm && this.itemId) {
      await this.loadScheduleStatus()
    }
  }
}
</script>

<style scoped>
.mnt-schedule-status-form {
  width: 100%;
}
</style>
