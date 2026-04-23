<template>
  <div class="mnt-bulk-schedule-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :title="$t('table.bulk_create') || 'Bulk Create Schedules'" :loading="isSubmitting" @submit="handleSubmit">
      <!-- Bulk Generation Mode -->
      <v-radio-group v-model="bulkMode" row class="mb-4 mt-0" hide-details>
        <v-radio label="By Product" value="product" color="primary"></v-radio>
        <v-radio label="By Product Type" value="type" color="primary"></v-radio>
      </v-radio-group>

      <!-- Start Date -->
      <v-menu
        v-model="startDateMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="fields.start_date"
            :label="$t('form.start_date') || 'Start Date'"
            prepend-inner-icon="mdi-calendar"
            readonly
            outlined
            dense
            clearable
            v-bind="attrs"
            v-on="on"
            :error-messages="errors.start_date || []"
            class="pb-2"
          />
        </template>
        <v-date-picker
          v-model="fields.start_date"
          no-title
          scrollable
          @input="startDateMenu = false"
        />
      </v-menu>

      <!-- End Date -->
      <v-menu
        v-model="endDateMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="fields.end_date"
            :label="$t('form.end_date') || 'End Date'"
            prepend-inner-icon="mdi-calendar"
            readonly
            outlined
            dense
            clearable
            v-bind="attrs"
            v-on="on"
            :error-messages="errors.end_date || []"
            class="pb-2"
          />
        </template>
        <v-date-picker
          v-model="fields.end_date"
          no-title
          scrollable
          @input="endDateMenu = false"
        />
      </v-menu>

      <!-- Product Category -->
      <v-autocomplete
        v-model="filterCategory"
        :items="invProductCategories"
        :item-text="getTranslatedName"
        item-value="id"
        :label="$t('form.inv_products_category_id') || 'Product Category'"
        clearable
        outlined
        dense
        class="mb-2"
      />

      <!-- Product Type -->
      <v-autocomplete
        v-model="filterType"
        :items="invProductTypes"
        :item-text="getTranslatedName"
        item-value="id"
        :label="$t('form.inv_products_type_id') || 'Product Type'"
        clearable
        outlined
        dense
        class="mb-2"
        :disabled="!invProductTypes.length"
        :error-messages="errors.inv_products_type_id || []"
        @change="clearError('inv_products_type_id')"
      />

      <!-- Manufacturer -->
      <v-autocomplete
        v-model="filterManufacturer"
        :items="invManufacturers"
        :item-text="getTranslatedName"
        item-value="id"
        :label="$t('form.inv_manufacturer_id') || 'Manufacturer'"
        clearable
        outlined
        dense
        class="mb-2"
      />

      <!-- Inventory Product -->
      <v-autocomplete
        v-if="bulkMode === 'product'"
        v-model="fields.inv_products_id"
        :items="filteredProducts"
        :item-text="getTranslatedName"
        item-value="id"
        :label="$t('form.inv_products_id') || 'Inventory Product'"
        clearable
        outlined
        dense
        class="mb-2"
        :error-messages="errors.inv_products_id || []"
        @change="clearError('inv_products_id')"
      />

      <!-- Frequency Model -->
      <v-autocomplete
        v-if="bulkMode === 'product'"
        v-model="fields.mnt_model_frequencies_ids"
        :items="filteredModelFrequencies"
        :item-text="getFrequencyName"
        item-value="id"
        :label="$t('form.mnt_model_frequencies') || 'Frequency Model'"
        multiple
        clearable
        outlined
        dense
        class="mb-2"
        :error-messages="errors.mnt_model_frequencies_ids || []"
        @change="clearError('mnt_model_frequencies_ids')"
        :disabled="!fields.inv_products_id || filteredModelFrequencies.length === 0"
      >
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index < 2" small>
            <span>{{ getFrequencyName(item) }}</span>
          </v-chip>
          <span v-if="index === 2" class="grey--text text-caption">
            (+{{ fields.mnt_model_frequencies_ids.length - 2 }} others)
          </span>
        </template>
      </v-autocomplete>

      <!-- Schedule Status -->
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
        :error-messages="errors.mnt_schedule_status_id || []"
        @change="clearError('mnt_schedule_status_id')"
      />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "MntBulkSchedulesForm",
  data() {
    return {
      fields: {
        start_date: "",
        end_date: "",
        inv_products_id: null,
        mnt_model_frequencies_ids: [],
        mnt_schedule_status_id: null,
      },
      errors: {},
      isSubmitting: false,
      isLoading: false,
      startDateMenu: false,
      endDateMenu: false,
      filterCategory: null,
      filterType: null,
      filterManufacturer: null,
      bulkMode: 'product',
    }
  },
  computed: {
    ...mapGetters({
      invProducts: "invProducts/getProducts",
      scheduleStatuses: "mntScheduleStatuses/getScheduleStatuses",
      mntModelFrequencies: "mntModelFrequencies/getModelFrequencies",
      invProductCategories: "invProductCategories/getProductCategories",
      invProductTypes: "invProductTypes/getProductTypes",
      invManufacturers: "invManufacturers/getManufacturers",
      invProductModels: "invProductModels/getProductModels"
    }),
    filteredProducts() {
      if (!this.invProducts) return [];
      let products = this.invProducts;
      if (this.filterCategory) {
        products = products.filter(p => p.inv_products_category_id === this.filterCategory);
      }
      if (this.filterType) {
        products = products.filter(p => p.inv_products_type_id === this.filterType);
      }
      if (this.filterManufacturer) {
        if (this.invProductModels) {
          const validModelIds = this.invProductModels
            .filter(m => m.inv_manufacturer_id === this.filterManufacturer)
            .map(m => m.id);
          products = products.filter(p => validModelIds.includes(p.inv_product_model_id));
        } else {
          products = [];
        }
      }
      return products;
    },
    filteredModelFrequencies() {
      if (!this.fields.inv_products_id || !this.mntModelFrequencies) return [];
      const selectedProduct = this.invProducts.find(p => p.id === this.fields.inv_products_id);
      if (!selectedProduct || !selectedProduct.inv_product_model_id) return [];
      return this.mntModelFrequencies.filter(f => f.inv_product_models_id === selectedProduct.inv_product_model_id);
    }
  },
  watch: {
    filterCategory() {
      this.filterType = null;
      this.filterManufacturer = null;
      this.fields.inv_products_id = null;
    },
    filterType() {
      this.filterManufacturer = null;
      this.fields.inv_products_id = null;
    },
    filterManufacturer() {
      this.fields.inv_products_id = null;
    },
    'fields.inv_products_id'(newVal) {
      if (newVal) {
        this.fields.mnt_model_frequencies_ids = [];
      }
    },
    bulkMode() {
      this.errors = {}
    }
  },
  methods: {
    ...mapActions({
      fetchInvProducts: "invProducts/fetchProducts",
      fetchScheduleStatuses: "mntScheduleStatuses/fetchScheduleStatuses",
      fetchModelFrequencies: "mntModelFrequencies/fetchModelFrequencies",
      fetchSchedules: "mntSchedules/fetchSchedules",
      fetchProductCategories: "invProductCategories/fetchProductCategories",
      fetchProductTypes: "invProductTypes/fetchProductTypes",
      fetchManufacturers: "invManufacturers/fetchManufacturers",
      fetchProductModels: "invProductModels/fetchProductModels"
    }),
    ...mapActions("drawer", ["closeDrawer"]),
    getTranslatedName(item) {
      if (!item || !item.name) return '';
      if (typeof item.name === 'object') {
        return this.$i18n && this.$i18n.locale === 'ar' ? (item.name.ar || item.name.en) : (item.name.en || item.name.ar);
      }
      return item.name;
    },
    getFrequencyName(item) {
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
        let payload = {}
        let endpoint = ''

        if (this.bulkMode === 'product') {
          payload = {
            start_date: this.fields.start_date,
            end_date: this.fields.end_date,
            inv_products_id: this.fields.inv_products_id,
            mnt_model_frequencies_ids: this.fields.mnt_model_frequencies_ids,
            mnt_schedule_status_id: this.fields.mnt_schedule_status_id,
          }
          endpoint = '/mnt-schedules/bulk-create'
        } else {
          payload = {
            start_date: this.fields.start_date,
            end_date: this.fields.end_date,
            inv_products_type_id: this.filterType,
            mnt_schedule_status_id: this.fields.mnt_schedule_status_id,
          }
          endpoint = '/mnt-schedules/bulk-create-by-type'
        }

        const response = await this.$axios.post(endpoint, payload)

        if (response.data && response.data.status === 'success') {
          this.$toast.success(response.data.message || this.$t('message.success'))
          this.fetchSchedules()
          this.closeDrawer()
        }
      } catch (error) {
        const apiErrors = error?.response?.data?.message || error?.response?.data?.errors
        if (apiErrors && typeof apiErrors === "object") {
          this.errors = apiErrors
        } else if (error?.response?.data?.message) {
          this.$toast.error(error.response.data.message)
        }
        console.error("Error saving Bulk Schedules:", error)
      } finally {
        this.isSubmitting = false
      }
    }
  },
  mounted() {
    this.fetchInvProducts()
    this.fetchScheduleStatuses()
    this.fetchModelFrequencies()
    this.fetchProductCategories()
    this.fetchProductTypes()
    this.fetchManufacturers()
    this.fetchProductModels()
  }
}
</script>

<style scoped>
.mnt-bulk-schedule-form { width: 100%; }
</style>
