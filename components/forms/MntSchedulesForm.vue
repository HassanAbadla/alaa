<template>
  <div class="mnt-schedule-form">
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
      <custom-input
        v-model="fields.date"
        :label="$t('form.date') || 'Date'"
        type="date"
        :errors="errors.date"
        @clear-errors="clearError('date')"
      />
      <v-autocomplete
        v-model="fields.inv_products_id"
        :items="invProducts"
        item-text="name"
        item-value="id"
        :label="$t('form.inv_products_id') || 'Inventory Product'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <v-autocomplete
        v-model="fields.mnt_schedule_status_id"
        :items="scheduleStatuses"
        item-text="name"
        item-value="id"
        :label="$t('form.mnt_schedule_status_id') || 'Schedule Status'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <v-checkbox
        v-model="fields.isdone"
        :label="$t('form.isdone') || 'Is Done'"
        dense
        class="mb-2"
      />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "MntSchedulesForm",
  props: {
    editForm: { type: Boolean, default: false },
    itemId: { type: [Number, String], default: null }
  },
  data() {
    return {
      fields: {
        code: "",
        name: { en: "", ar: "" },
        date: null,
        inv_products_id: null,
        mnt_schedule_status_id: null,
        isdone: false,
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      schedules: "mntSchedules/getSchedules",
      currentSchedule: "mntSchedules/getCurrentSchedule",
      invProducts: "invProducts/getProducts",
      scheduleStatuses: "mntScheduleStatuses/getScheduleStatuses"
    }),
    title() {
      return `${this.editForm ? 'Edit' : 'Create'} Schedule`
    }
  },
  methods: {
    ...mapActions({
      addSchedule: "mntSchedules/addSchedule",
      updateSchedule: "mntSchedules/updateSchedule",
      fetchScheduleById: "mntSchedules/fetchScheduleById",
      fetchInvProducts: "invProducts/fetchProducts",
      fetchScheduleStatuses: "mntScheduleStatuses/fetchScheduleStatuses"
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
          date: this.fields.date,
          inv_products_id: this.fields.inv_products_id,
          mnt_schedule_status_id: this.fields.mnt_schedule_status_id,
          isdone: this.fields.isdone,
        }

        const result = this.editForm
          ? await this.updateSchedule({ ...payload, id: this.itemId })
          : await this.addSchedule(payload)

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
        console.error("Error saving Schedule:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadSchedule() {
      this.isLoading = true
      try {
        let schedule = this.schedules?.find((c) => c.id === this.itemId)
        if (!schedule) {
          schedule = await this.fetchScheduleById(this.itemId)
        } else {
          await this.fetchScheduleById(this.itemId)
        }

        const source = schedule || this.currentSchedule
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            date: source.date || null,
            inv_products_id: source.inv_products_id || null,
            mnt_schedule_status_id: source.mnt_schedule_status_id || null,
            isdone: source.isdone || false,
          }
        }
      } catch (error) {
        console.error("Error loading Schedule:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    this.fetchInvProducts()
    this.fetchScheduleStatuses()
    if (this.editForm && this.itemId) {
      await this.loadSchedule()
    }
  }
}
</script>

<style scoped>
.mnt-schedule-form { width: 100%; }
</style>
