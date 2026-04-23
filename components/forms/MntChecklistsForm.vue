<template>
  <div class="mnt-checklist-form">
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
        v-model="fields.mnt_model_frequency_id"
        :items="modelFrequencies"
        item-text="name"
        item-value="id"
        :label="$t('form.mnt_model_frequency_id') || 'Model Frequency'"
        :errors="errors.mnt_model_frequency_id"
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
  name: "MntChecklistsForm",
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
        mnt_model_frequency_id: null,
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      checklists: "mntChecklists/getChecklists",
      currentChecklist: "mntChecklists/getCurrentChecklist",
      modelFrequencies: "mntModelFrequencies/getModelFrequencies"
    }),
    title() {
      return `${this.editForm ? 'Edit' : 'Create'} Checklist`
    }
  },
  methods: {
    ...mapActions({
      addChecklist: "mntChecklists/addChecklist",
      updateChecklist: "mntChecklists/updateChecklist",
      fetchChecklistById: "mntChecklists/fetchChecklistById",
      fetchModelFrequencies: "mntModelFrequencies/fetchModelFrequencies"
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
          mnt_model_frequency_id: this.fields.mnt_model_frequency_id,
        }

        const result = this.editForm
          ? await this.updateChecklist({ ...payload, id: this.itemId })
          : await this.addChecklist(payload)

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
        console.error("Error saving Checklist:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadChecklist() {
      this.isLoading = true
      try {
        let checklist = this.checklists?.find((c) => c.id === this.itemId)
        if (!checklist) {
          checklist = await this.fetchChecklistById(this.itemId)
        } else {
          await this.fetchChecklistById(this.itemId)
        }

        const source = checklist || this.currentChecklist
        if (source) {
          this.fields = {
            code: source.code || "",
            name: {
              en: source.name?.en || "",
              ar: source.name?.ar || ""
            },
            mnt_model_frequency_id: source.mnt_model_frequency_id || null,
          }
        }
      } catch (error) {
        console.error("Error loading Checklist:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    this.fetchModelFrequencies()
    if (this.editForm && this.itemId) {
      await this.loadChecklist()
    }
  }
}
</script>

<style scoped>
.mnt-checklist-form {
  width: 100%;
}
</style>
