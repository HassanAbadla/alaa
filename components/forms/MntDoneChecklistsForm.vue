<template>
  <div class="mnt-done-checklist-form">
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
        v-model="fields.mnt_checklist_id"
        :items="checklists"
        item-text="name"
        item-value="id"
        :label="$t('form.mnt_checklist_id') || 'Checklist'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <v-autocomplete
        v-model="fields.mnt_maintenance_request_id"
        :items="maintenanceRequests"
        item-text="name"
        item-value="id"
        :label="$t('form.mnt_maintenance_request_id') || 'Maintenance Request'"
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
  name: "MntDoneChecklistsForm",
  props: {
    editForm: { type: Boolean, default: false },
    itemId: { type: [Number, String], default: null }
  },
  data() {
    return {
      fields: {
        code: "",
        name: { en: "", ar: "" },
        mnt_checklist_id: null,
        mnt_maintenance_request_id: null,
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      doneChecklists: "mntDoneChecklists/getDoneChecklists",
      currentDoneChecklist: "mntDoneChecklists/getCurrentDoneChecklist",
      checklists: "mntChecklists/getChecklists",
      maintenanceRequests: "mntMaintenanceRequests/getMaintenanceRequests"
    }),
    title() {
      return `${this.editForm ? 'Edit' : 'Create'} Done Checklist`
    }
  },
  methods: {
    ...mapActions({
      addDoneChecklist: "mntDoneChecklists/addDoneChecklist",
      updateDoneChecklist: "mntDoneChecklists/updateDoneChecklist",
      fetchDoneChecklistById: "mntDoneChecklists/fetchDoneChecklistById",
      fetchChecklists: "mntChecklists/fetchChecklists",
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
          mnt_checklist_id: this.fields.mnt_checklist_id,
          mnt_maintenance_request_id: this.fields.mnt_maintenance_request_id,
        }

        const result = this.editForm
          ? await this.updateDoneChecklist({ ...payload, id: this.itemId })
          : await this.addDoneChecklist(payload)

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
        console.error("Error saving Done Checklist:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadDoneChecklist() {
      this.isLoading = true
      try {
        let doneChecklist = this.doneChecklists?.find((c) => c.id === this.itemId)
        if (!doneChecklist) {
          doneChecklist = await this.fetchDoneChecklistById(this.itemId)
        } else {
          await this.fetchDoneChecklistById(this.itemId)
        }

        const source = doneChecklist || this.currentDoneChecklist
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            mnt_checklist_id: source.mnt_checklist_id || null,
            mnt_maintenance_request_id: source.mnt_maintenance_request_id || null,
          }
        }
      } catch (error) {
        console.error("Error loading Done Checklist:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    this.fetchChecklists()
    if (this.editForm && this.itemId) {
      await this.loadDoneChecklist()
    }
  }
}
</script>

<style scoped>
.mnt-done-checklist-form { width: 100%; }
</style>
