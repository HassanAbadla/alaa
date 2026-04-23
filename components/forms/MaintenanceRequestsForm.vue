<template>
  <div class="mnt-request-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :title="title" :loading="isSubmitting" @submit="handleSubmit">
      <custom-input
        v-model="fields.code"
        :label="$t('form.code') || 'Code'"
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
        v-model="fields.mnt_assets_id"
        :items="assets"
        item-text="name"
        item-value="id"
        :label="$t('form.mnt_assets_id') || 'Asset'"
        clearable
        outlined
        dense
        class="mb-2"
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
        v-model="fields.mnt_maintenance_type_id"
        :items="maintenanceTypes"
        item-text="name"
        item-value="id"
        :label="$t('form.mnt_maintenance_type_id') || 'Maintenance Type'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <v-autocomplete
        v-model="fields.mnt_request_priority_id"
        :items="priorities"
        item-text="name"
        item-value="id"
        :label="$t('form.mnt_request_priority_id') || 'Priority'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <v-autocomplete
        v-model="fields.mnt_request_status_id"
        :items="statuses"
        item-text="name"
        item-value="id"
        :label="$t('form.mnt_request_status_id') || 'Status'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <v-autocomplete
        v-model="fields.user_id"
        :items="users"
        item-text="name"
        item-value="id"
        :label="$t('form.user_id') || 'Requester (User)'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <v-autocomplete
        v-model="fields.user_receiver_id"
        :items="users"
        item-text="name"
        item-value="id"
        :label="$t('form.user_receiver_id') || 'Assignee (Receiver)'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <custom-input
        v-model="fields.note"
        :label="$t('form.note') || 'Note'"
        :errors="errors.note"
        @clear-errors="clearError('note')"
      />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "MaintenanceRequestsForm",
  props: {
    editForm: { type: Boolean, default: false },
    itemId: { type: [Number, String], default: null }
  },
  data() {
    return {
      fields: {
        code: "",
        name: { en: "", ar: "" },
        note: "",
        date: "",
        mnt_assets_id: null,
        mnt_schedule_id: null,
        mnt_maintenance_type_id: null,
        mnt_request_priority_id: null,
        mnt_request_status_id: null,
        user_id: null,
        user_receiver_id: null,
      },
      errors: {},
      isSubmitting: false,
      isLoading: false,
      assets: [],
      schedules: [],
      maintenanceTypes: [],
      priorities: [],
      statuses: [],
      users: [],
    }
  },
  computed: {
    ...mapGetters({
      maintenanceRequests: "maintenanceRequests/getMaintenanceRequests",
      currentMaintenanceRequest: "maintenanceRequests/getCurrentMaintenanceRequest"
    }),
    title() {
      return `${this.editForm ? 'Edit' : 'Create'} Maintenance Request`
    }
  },
  methods: {
    ...mapActions({
      addMaintenanceRequest: "maintenanceRequests/addMaintenanceRequest",
      updateMaintenanceRequest: "maintenanceRequests/updateMaintenanceRequest",
      fetchMaintenanceRequestById: "maintenanceRequests/fetchMaintenanceRequestById",
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    clearError(field) {
      if (this.errors[field]) {
        this.$set(this.errors, field, [])
      }
    },
    async fetchLookups() {
      try {
        const [assetsRes, schedulesRes, usersRes, typesRes, prioritiesRes, statusesRes] =
          await Promise.all([
            this.$axios.get('/mnt-assets?limit=-1'),
            this.$axios.get('/mnt-schedules?limit=-1'),
            this.$axios.get('/orders-users'),
            this.$axios.get('/types?limit=-1'),
            this.$axios.get('/priorities?limit=-1'),
            this.$axios.get('/orders-status?limit=-1'),
          ])
        this.assets = assetsRes.data?.data || []
        this.schedules = schedulesRes.data?.data || []
        this.users = usersRes.data?.data || []
        this.maintenanceTypes = typesRes.data?.data || []
        this.priorities = prioritiesRes.data?.data || []
        this.statuses = statusesRes.data?.data || []
      } catch (error) {
        console.error('Failed to fetch lookups', error)
      }
    },
    async handleSubmit() {
      this.isSubmitting = true
      this.errors = {}
      try {
        const payload = {
          code: this.fields.code,
          name: this.fields.name,
          note: this.fields.note,
          date: this.fields.date,
          mnt_assets_id: this.fields.mnt_assets_id,
          mnt_schedule_id: this.fields.mnt_schedule_id,
          mnt_maintenance_type_id: this.fields.mnt_maintenance_type_id,
          mnt_request_priority_id: this.fields.mnt_request_priority_id,
          mnt_request_status_id: this.fields.mnt_request_status_id,
          user_id: this.fields.user_id,
          user_receiver_id: this.fields.user_receiver_id,
        }

        const result = this.editForm
          ? await this.updateMaintenanceRequest({ ...payload, id: this.itemId })
          : await this.addMaintenanceRequest(payload)

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
        console.error("Error saving Maintenance Request:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadMaintenanceRequest() {
      this.isLoading = true
      try {
        let item = this.maintenanceRequests?.find((c) => c.id === this.itemId)
        if (!item) {
          item = await this.fetchMaintenanceRequestById(this.itemId)
        } else {
          await this.fetchMaintenanceRequestById(this.itemId)
        }

        const source = item || this.currentMaintenanceRequest
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            note: source.note || "",
            date: source.date || "",
            mnt_assets_id: source.mnt_assets_id || null,
            mnt_schedule_id: source.mnt_schedule_id || null,
            mnt_maintenance_type_id: source.mnt_maintenance_type_id || null,
            mnt_request_priority_id: source.mnt_request_priority_id || null,
            mnt_request_status_id: source.mnt_request_status_id || null,
            user_id: source.user_id || null,
            user_receiver_id: source.user_receiver_id || null,
          }
        }
      } catch (error) {
        console.error("Error loading Maintenance Request:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    this.fetchLookups()
    if (this.editForm && this.itemId) {
      await this.loadMaintenanceRequest()
    }
  }
}
</script>

<style scoped>
.mnt-request-form { width: 100%; }
</style>
