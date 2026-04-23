<template>
  <div class="inv-product-model-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :title="title" :loading="isSubmitting" @submit="handleSubmit">
      <custom-select
        v-model="fields.inv_manufacturer_id"
        :label="$t('form.manufacturer')"
        :items="manufacturers"
        item-text="name"
        item-value="id"
        :required="true"
        :errors="errors.inv_manufacturer_id"
        @clear-errors="clearError('inv_manufacturer_id')"
      />
      <custom-select
        v-model="fields.inv_product_type_id"
        :label="$t('form.product_type')"
        :items="productTypes"
        item-text="name"
        item-value="id"
        clearable
        :errors="errors.inv_product_type_id"
        @clear-errors="clearError('inv_product_type_id')"
      />
      <custom-select
        v-model="fields.inv_product_model_id"
        :label="$t('form.parent_model')"
        :items="parentModelOptions"
        item-text="inv_model"
        item-value="id"
        clearable
        :errors="errors.inv_product_model_id"
        @clear-errors="clearError('inv_product_model_id')"
      />
      <custom-input
        v-model="fields.inv_model"
        :label="$t('form.model')"
        :errors="errors.inv_model"
        @clear-errors="clearError('inv_model')"
      />
      <custom-input
        v-model="fields.inv_model_power_consumption"
        :label="$t('form.power_consumption')"
        type="number"
        :errors="errors.inv_model_power_consumption"
        @clear-errors="clearError('inv_model_power_consumption')"
      />
      <custom-select
        v-model="fields.inv_model_uom_id"
        :label="$t('form.uom')"
        :items="uoms"
        item-text="name"
        item-value="id"
        :errors="errors.inv_model_uom_id"
        @clear-errors="clearError('inv_model_uom_id')"
      />
      <custom-input
        v-model="fields.inv_model_capacity_text"
        :label="$t('form.capacity')"
        :errors="errors.inv_model_capacity_text"
        @clear-errors="clearError('inv_model_capacity_text')"
      />
      <custom-input
        v-model="fields.inv_model_uom_text"
        :label="$t('form.uom_text')"
        :errors="errors.inv_model_uom_text"
        @clear-errors="clearError('inv_model_uom_text')"
      />
      <custom-input
        v-model="fields.capacity_unit"
        :label="$t('form.capacity_unit')"
        :errors="errors.capacity_unit"
        @clear-errors="clearError('capacity_unit')"
      />
      <custom-input
        v-model.number="fields.design_capacity"
        :label="$t('form.design_capacity')"
        type="number"
        :errors="errors.design_capacity"
        @clear-errors="clearError('design_capacity')"
      />
      <custom-input
        v-model.number="fields.power"
        :label="$t('form.power')"
        type="number"
        :errors="errors.power"
        @clear-errors="clearError('power')"
      />
      <custom-input
        v-model="fields.power_unit"
        :label="$t('form.power_unit')"
        :errors="errors.power_unit"
        @clear-errors="clearError('power_unit')"
      />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "InvProductModelsForm",
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
        inv_manufacturer_id: null,
        inv_product_type_id: null,
        inv_product_model_id: null,
        inv_model: "",
        inv_model_power_consumption: null,
        inv_model_uom_id: null,
        inv_model_capacity_text: "",
        inv_model_uom_text: "",
        capacity_unit: "",
        design_capacity: null,
        power: null,
        power_unit: ""
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      productModels: "invProductModels/getProductModels",
      currentProductModel: "invProductModels/getCurrentProductModel",
      manufacturers: "invManufacturers/getManufacturers",
      productTypes: "invProductTypes/getProductTypes",
      uoms: "invUoms/getUoms"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_product_model")}`
    },
    parentModelOptions() {
      if (this.editForm && this.itemId) {
        return this.productModels.filter((m) => m.id !== this.itemId)
      }
      return this.productModels
    }
  },
  methods: {
    ...mapActions({
      addProductModel: "invProductModels/addProductModel",
      updateProductModel: "invProductModels/updateProductModel",
      fetchProductModels: "invProductModels/fetchProductModels",
      fetchProductModelById: "invProductModels/fetchProductModelById",
      fetchManufacturers: "invManufacturers/fetchManufacturers",
      fetchProductTypes: "invProductTypes/fetchProductTypes",
      fetchUoms: "invUoms/fetchUoms"
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
          inv_manufacturer_id: Number(this.fields.inv_manufacturer_id),
          inv_product_type_id: this.fields.inv_product_type_id
            ? Number(this.fields.inv_product_type_id)
            : null,
          inv_product_model_id: this.fields.inv_product_model_id
            ? Number(this.fields.inv_product_model_id)
            : null,
          inv_model: this.fields.inv_model,
          inv_model_power_consumption: this.fields.inv_model_power_consumption
            ? Number(this.fields.inv_model_power_consumption)
            : null,
          inv_model_uom_id: this.fields.inv_model_uom_id
            ? Number(this.fields.inv_model_uom_id)
            : null,
          inv_model_capacity_text: this.fields.inv_model_capacity_text,
          inv_model_uom_text: this.fields.inv_model_uom_text,
          capacity_unit: this.fields.capacity_unit || null,
          design_capacity: this.fields.design_capacity ? Number(this.fields.design_capacity) : null,
          power: this.fields.power ? Number(this.fields.power) : null,
          power_unit: this.fields.power_unit || null
        }

        const result = this.editForm
          ? await this.updateProductModel({ ...payload, id: this.itemId })
          : await this.addProductModel(payload)

        if (result?.success === false && result?.errors) {
          this.errors = result.errors
          return
        }

        this.closeDrawer()
      } catch (error) {
        const apiErrors = error?.response?.data?.message
        if (apiErrors && typeof apiErrors === "object") {
          this.errors = apiErrors
        }
        console.error("Error saving product model:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadProductModel() {
      this.isLoading = true
      try {
        let productModel = this.productModels?.find((m) => m.id === this.itemId)
        if (!productModel) {
          productModel = await this.fetchProductModelById(this.itemId)
        } else {
          await this.fetchProductModelById(this.itemId)
        }

        const source = productModel || this.currentProductModel
        if (source) {
          this.fields = {
            inv_manufacturer_id: source.inv_manufacturer_id || null,
            inv_product_type_id: source.inv_product_type_id || null,
            inv_product_model_id: source.inv_product_model_id || null,
            inv_model: source.inv_model || "",
            inv_model_power_consumption: source.inv_model_power_consumption || null,
            inv_model_uom_id: source.inv_model_uom_id || null,
            inv_model_capacity_text: source.inv_model_capacity_text || "",
            inv_model_uom_text: source.inv_model_uom_text || "",
            capacity_unit: source.capacity_unit || "",
            design_capacity: source.design_capacity ? Number(source.design_capacity) : null,
            power: source.power ? Number(source.power) : null,
            power_unit: source.power_unit || ""
          }
        }
      } catch (error) {
        console.error("Error loading product model:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    await Promise.all([
      this.fetchProductModels(),
      this.fetchManufacturers(),
      this.fetchProductTypes(),
      this.fetchUoms()
    ])
    if (this.editForm && this.itemId) {
      await this.loadProductModel()
    }
  }
}
</script>

<style scoped>
.inv-product-model-form {
  width: 100%;
}
</style>
