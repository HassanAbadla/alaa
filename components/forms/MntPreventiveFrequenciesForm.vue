<template>
  <div class="mnt-preventive-frequency-form">
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
        v-model="fields.multiple"
        :label="$t('form.multiple') || 'Multiple'"
        type="number"
        :errors="errors.multiple"
        @clear-errors="clearError('multiple')"
      />
      <custom-input
        v-model="fields.color"
        :label="$t('form.color') || 'Color'"
        :errors="errors.color"
        @clear-errors="clearError('color')"
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
  name: "MntPreventiveFrequenciesForm",
  props: {
    editForm: { type: Boolean, default: false },
    itemId: { type: [Number, String], default: null }
  },
  data() {
    return {
      fields: {
        code: "",
        name: { en: "", ar: "" },
        multiple: null,
        color: "",
        note: "",
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      preventiveFrequencies: "mntPreventiveFrequencies/getPreventiveFrequencies",
      currentPreventiveFrequency: "mntPreventiveFrequencies/getCurrentPreventiveFrequency"
    }),
    title() {
      return `${this.editForm ? 'Edit' : 'Create'} Preventive Frequency`
    }
  },
  methods: {
    ...mapActions({
      addPreventiveFrequency: "mntPreventiveFrequencies/addPreventiveFrequency",
      updatePreventiveFrequency: "mntPreventiveFrequencies/updatePreventiveFrequency",
      fetchPreventiveFrequencyById: "mntPreventiveFrequencies/fetchPreventiveFrequencyById",
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
          multiple: this.fields.multiple,
          color: this.fields.color,
          note: this.fields.note,
        }

        const result = this.editForm
          ? await this.updatePreventiveFrequency({ ...payload, id: this.itemId })
          : await this.addPreventiveFrequency(payload)

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
        console.error("Error saving Preventive Frequency:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadPreventiveFrequency() {
      this.isLoading = true
      try {
        let item = this.preventiveFrequencies?.find((c) => c.id === this.itemId)
        if (!item) {
          item = await this.fetchPreventiveFrequencyById(this.itemId)
        } else {
          await this.fetchPreventiveFrequencyById(this.itemId)
        }

        const source = item || this.currentPreventiveFrequency
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            multiple: source.multiple || null,
            color: source.color || "",
            note: source.note || "",
          }
        }
      } catch (error) {
        console.error("Error loading Preventive Frequency:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    if (this.editForm && this.itemId) {
      await this.loadPreventiveFrequency()
    }
  }
}
</script>

<style scoped>
.mnt-preventive-frequency-form { width: 100%; }
</style>
