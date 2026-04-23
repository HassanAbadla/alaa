<template>
  <div class="mnt-model-frequency-form">
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
        v-model="fields.mnt_preventive_frequency_id"
        :items="preventiveFrequencies"
        item-text="name"
        item-value="id"
        :label="$t('form.mnt_preventive_frequency_id') || 'Preventive Frequency'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <!-- Manufacturer Filter -->
      <v-autocomplete
        v-model="filterManufacturer"
        :items="manufacturers"
        item-text="name"
        item-value="id"
        :label="$t('form.manufacturer') || 'Filter By Manufacturer'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <!-- Product Model -->
      <v-autocomplete
        v-model="fields.inv_product_models_id"
        :items="filteredModels"
        item-text="inv_model"
        item-value="id"
        :label="$t('form.inv_product_models_id') || 'Product Model'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <custom-input
        v-model="fields.days"
        :label="$t('form.days') || 'Days'"
        type="number"
        :errors="errors.days"
        @clear-errors="clearError('days')"
      />
      <custom-input
        v-model="fields.hours"
        :label="$t('form.hours') || 'Hours'"
        type="number"
        :errors="errors.hours"
        @clear-errors="clearError('hours')"
      />
      <custom-input
        v-model="fields.recoverytime"
        :label="$t('form.recoverytime') || 'Recovery Time'"
        type="number"
        :errors="errors.recoverytime"
        @clear-errors="clearError('recoverytime')"
      />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "MntModelFrequenciesForm",
  props: {
    editForm: { type: Boolean, default: false },
    itemId: { type: [Number, String], default: null }
  },
  data() {
    return {
      fields: {
        code: "",
        name: { en: "", ar: "" },
        mnt_preventive_frequency_id: null,
        inv_product_models_id: null,
        days: null,
        hours: null,
        recoverytime: null,
      },
      errors: {},
      isSubmitting: false,
      isLoading: false,
      filterManufacturer: null
    }
  },
  watch: {
    filterManufacturer() {
      this.fields.inv_product_models_id = null;
    }
  },
  computed: {
    ...mapGetters({
      modelFrequencies: "mntModelFrequencies/getModelFrequencies",
      currentModelFrequency: "mntModelFrequencies/getCurrentModelFrequency",
      preventiveFrequencies: "mntPreventiveFrequencies/getPreventiveFrequencies",
      productModels: "invProductModels/getProductModels",
      manufacturers: "invManufacturers/getManufacturers"
    }),
    filteredModels() {
      if (!this.productModels) return [];
      if (!this.filterManufacturer) return this.productModels;

      return this.productModels.filter(m => m.inv_manufacturer_id === this.filterManufacturer);
    },
    title() {
      return `${this.editForm ? 'Edit' : 'Create'} Model Frequency`
    }
  },
  methods: {
    ...mapActions({
      addModelFrequency: "mntModelFrequencies/addModelFrequency",
      updateModelFrequency: "mntModelFrequencies/updateModelFrequency",
      fetchModelFrequencyById: "mntModelFrequencies/fetchModelFrequencyById",
      fetchProductModels: "invProductModels/fetchProductModels",
      fetchPreventiveFrequencies: "mntPreventiveFrequencies/fetchPreventiveFrequencies"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    getTranslatedName(item) {
      if (!item || !item.name) return '';
      if (typeof item.name === 'object') {
        return this.$i18n && this.$i18n.locale === 'ar' ? (item.name.ar || item.name.en) : (item.name.en || item.name.ar);
      }
      return item.name;
    },
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
          mnt_preventive_frequency_id: this.fields.mnt_preventive_frequency_id,
          inv_product_models_id: this.fields.inv_product_models_id,
          days: this.fields.days,
          hours: this.fields.hours,
          recoverytime: this.fields.recoverytime,
        }

        const result = this.editForm
          ? await this.updateModelFrequency({ ...payload, id: this.itemId })
          : await this.addModelFrequency(payload)

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
        console.error("Error saving Model Frequency:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadModelFrequency() {
      this.isLoading = true
      try {
        let modelFrequency = this.modelFrequencies?.find((c) => c.id === this.itemId)
        if (!modelFrequency) {
          modelFrequency = await this.fetchModelFrequencyById(this.itemId)
        } else {
          await this.fetchModelFrequencyById(this.itemId)
        }

        const source = modelFrequency || this.currentModelFrequency
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            mnt_preventive_frequency_id: source.mnt_preventive_frequency_id || null,
            inv_product_models_id: source.inv_product_models_id || null,
            days: source.days || null,
            hours: source.hours || null,
            recoverytime: source.recoverytime || null,
          }
        }
      } catch (error) {
        console.error("Error loading Model Frequency:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    this.fetchProductModels()
    this.fetchPreventiveFrequencies()
    this.$store.dispatch('invManufacturers/fetchManufacturers')
    
    if (this.editForm && this.itemId) {
      await this.loadModelFrequency()
    }
  }
}
</script>

<style scoped>
.mnt-model-frequency-form { width: 100%; }
</style>
