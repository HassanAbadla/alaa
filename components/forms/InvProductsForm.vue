<template>
  <div class="inv-product-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :title="title" :loading="isSubmitting" @submit="handleSubmit">
      <custom-input
        v-model="fields.code"
        :label="$t('form.code')"
        :required="true"
        :errors="errors.code"
        @clear-errors="clearError('code')"
      />
      <custom-input
        v-model="fields.name"
        :label="$t('form.name')"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      />
      <custom-select
        v-model="fields.inv_products_type_id"
        :label="$t('form.product_type')"
        :items="productTypes"
        item-text="name"
        item-value="id"
        :required="true"
        :loading="productTypesLoading"
        :errors="errors.inv_products_type_id"
        @clear-errors="clearError('inv_products_type_id')"
      />
      <custom-select
        v-model="fields.inv_products_category_id"
        :label="$t('form.product_category')"
        :items="productCategories"
        item-text="name"
        item-value="id"
        :required="true"
        :loading="productCategoriesLoading"
        :errors="errors.inv_products_category_id"
        @clear-errors="clearError('inv_products_category_id')"
      />
      <custom-input
        v-model.number="fields.inv_unit_price"
        :label="$t('form.unit_price')"
        type="number"
        :required="true"
        :errors="errors.inv_unit_price"
        @clear-errors="clearError('inv_unit_price')"
      />
      <custom-input
        v-model.number="fields.inv_reorder_level"
        :label="$t('form.reorder_level')"
        type="number"
        :required="true"
        :errors="errors.inv_reorder_level"
        @clear-errors="clearError('inv_reorder_level')"
      />
      <custom-input
        v-model.number="fields.inv_qty_total"
        :label="$t('form.total_quantity')"
        type="number"
        :required="true"
        :errors="errors.inv_qty_total"
        @clear-errors="clearError('inv_qty_total')"
      />
      <custom-select
        v-model="fields.inv_manufacturer_id"
        :label="$t('form.manufacturer')"
        :items="manufacturers"
        item-text="name"
        item-value="id"
        :errors="errors.inv_manufacturer_id"
        @clear-errors="clearError('inv_manufacturer_id')"
      />
      <custom-select
        v-model="fields.inv_uom_id"
        :label="$t('form.uom')"
        :items="uoms"
        item-text="name"
        item-value="id"
        :errors="errors.inv_uom_id"
        @clear-errors="clearError('inv_uom_id')"
      />
      <custom-select
        v-model="fields.buildings_id"
        :label="$t('form.building')"
        :items="buildings"
        item-text="name"
        item-value="id"
        :errors="errors.buildings_id"
        @clear-errors="clearError('buildings_id')"
      />
      <custom-select
        v-model="fields.inv_product_items_id"
        :label="$t('form.product_model')"
        :items="productModels"
        item-text="inv_model"
        item-value="id"
        :errors="errors.inv_product_items_id"
        @clear-errors="clearError('inv_product_items_id')"
      />
      <custom-input
        v-model="fields.inv_serial_owner"
        :label="$t('form.serial_owner')"
        :errors="errors.inv_serial_owner"
        @clear-errors="clearError('inv_serial_owner')"
      />
      <custom-input
        v-model="fields.inv_serial_Manufacturer"
        :label="$t('form.serial_manufacturer')"
        :errors="errors.inv_serial_Manufacturer"
        @clear-errors="clearError('inv_serial_Manufacturer')"
      />
      <custom-input
        v-model="fields.inv_class"
        :label="$t('form.inv_class')"
        :errors="errors.inv_class"
        @clear-errors="clearError('inv_class')"
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
        v-model="fields.year_of_installation"
        :label="$t('form.year_of_installation')"
        type="number"
        :errors="errors.year_of_installation"
        @clear-errors="clearError('year_of_installation')"
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
      <custom-input
        v-model.number="fields.asset_original_value"
        :label="$t('form.asset_original_value')"
        type="number"
        :errors="errors.asset_original_value"
        @clear-errors="clearError('asset_original_value')"
      />
      <custom-input
        v-model.number="fields.annual_maintenance_labor_cost"
        :label="$t('form.annual_maintenance_labor_cost')"
        type="number"
        :errors="errors.annual_maintenance_labor_cost"
        @clear-errors="clearError('annual_maintenance_labor_cost')"
      />
      <custom-input
        v-model.number="fields.spares_cost"
        :label="$t('form.spares_cost')"
        type="number"
        :errors="errors.spares_cost"
        @clear-errors="clearError('spares_cost')"
      />
      <custom-input
        v-model.number="fields.annual_maintenance_cost"
        :label="$t('form.annual_maintenance_cost')"
        type="number"
        :errors="errors.annual_maintenance_cost"
        @clear-errors="clearError('annual_maintenance_cost')"
      />
      <custom-input
        v-model.number="fields.consumables_cost"
        :label="$t('form.consumables_cost')"
        type="number"
        :errors="errors.consumables_cost"
        @clear-errors="clearError('consumables_cost')"
      />
      <custom-select
        v-model="fields.inv_operational_mode_id"
        :label="$t('form.operational_mode')"
        :items="operationalModes"
        item-text="name"
        item-value="id"
        :errors="errors.inv_operational_mode_id"
        @clear-errors="clearError('inv_operational_mode_id')"
      />
      <custom-select
        v-model="fields.inv_operational_condition_id"
        :label="$t('form.operational_condition')"
        :items="operationalConditions"
        item-text="name"
        item-value="id"
        :errors="errors.inv_operational_condition_id"
        @clear-errors="clearError('inv_operational_condition_id')"
      />
      <custom-input
        v-model="fields.identified_defect"
        :label="$t('form.identified_defect')"
        :errors="errors.identified_defect"
        @clear-errors="clearError('identified_defect')"
      />
      <quill-editor v-model="fields.note" :field-info-text="$t('table.note')" />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "InvProductsForm",
  components: {
    QuillEditor
  },
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
        name: "",
        note: "",
        inv_products_type_id: null,
        inv_products_category_id: null,
        inv_unit_price: 0,
        inv_reorder_level: 0,
        inv_qty_total: 0,
        inv_manufacturer_id: null,
        inv_uom_id: null,
        buildings_id: null,
        inv_serial_owner: "",
        inv_serial_Manufacturer: "",
        inv_product_items_id: null,
        inv_class: "",
        capacity_unit: "",
        design_capacity: null,
        year_of_installation: null,
        power: null,
        power_unit: "",
        asset_original_value: null,
        annual_maintenance_labor_cost: null,
        spares_cost: null,
        annual_maintenance_cost: null,
        consumables_cost: null,
        inv_operational_mode_id: null,
        inv_operational_condition_id: null,
        identified_defect: ""
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      products: "invProducts/getProducts",
      currentProduct: "invProducts/getCurrentProduct",
      productTypes: "invProductTypes/getProductTypes",
      productCategories: "invProductCategories/getProductCategories",
      productTypesLoading: "invProductTypes/isLoading",
      productCategoriesLoading: "invProductCategories/isLoading",
      manufacturers: "invManufacturers/getManufacturers",
      uoms: "invUoms/getUoms",
      buildings: "buildings/getBuildings",
      productModels: "invProductModels/getProductModels",
      operationalModes: "invOperationalModes/getOperationalModes",
      operationalConditions: "invOperationalConditions/getOperationalConditions"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_product")}`
    }
  },
  methods: {
    ...mapActions({
      addProduct: "invProducts/addProduct",
      updateProduct: "invProducts/updateProduct",
      fetchProductById: "invProducts/fetchProductById",
      fetchProductTypes: "invProductTypes/fetchProductTypes",
      fetchProductCategories: "invProductCategories/fetchProductCategories",
      fetchManufacturers: "invManufacturers/fetchManufacturers",
      fetchUoms: "invUoms/fetchUoms",
      fetchBuildings: "buildings/fetchBuildings",
      fetchProductModels: "invProductModels/fetchProductModels",
      fetchOperationalModes: "invOperationalModes/fetchOperationalModes",
      fetchOperationalConditions: "invOperationalConditions/fetchOperationalConditions"
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
          note: this.fields.note,
          inv_products_type_id: Number(this.fields.inv_products_type_id),
          inv_products_category_id: Number(this.fields.inv_products_category_id),
          inv_unit_price: Number(this.fields.inv_unit_price),
          inv_reorder_level: Number(this.fields.inv_reorder_level),
          inv_qty_total: Number(this.fields.inv_qty_total),
          inv_manufacturer_id: this.fields.inv_manufacturer_id ? Number(this.fields.inv_manufacturer_id) : null,
          inv_uom_id: this.fields.inv_uom_id ? Number(this.fields.inv_uom_id) : null,
          buildings_id: this.fields.buildings_id ? Number(this.fields.buildings_id) : null,
          inv_serial_owner: this.fields.inv_serial_owner || null,
          inv_serial_Manufacturer: this.fields.inv_serial_Manufacturer || null,
          inv_product_items_id: this.fields.inv_product_items_id ? Number(this.fields.inv_product_items_id) : null,
          inv_class: this.fields.inv_class || null,
          capacity_unit: this.fields.capacity_unit || null,
          design_capacity: this.fields.design_capacity ? Number(this.fields.design_capacity) : null,
          year_of_installation: this.fields.year_of_installation ? Number(this.fields.year_of_installation) : null,
          power: this.fields.power ? Number(this.fields.power) : null,
          power_unit: this.fields.power_unit || null,
          asset_original_value: this.fields.asset_original_value ? Number(this.fields.asset_original_value) : null,
          annual_maintenance_labor_cost: this.fields.annual_maintenance_labor_cost ? Number(this.fields.annual_maintenance_labor_cost) : null,
          spares_cost: this.fields.spares_cost ? Number(this.fields.spares_cost) : null,
          annual_maintenance_cost: this.fields.annual_maintenance_cost ? Number(this.fields.annual_maintenance_cost) : null,
          consumables_cost: this.fields.consumables_cost ? Number(this.fields.consumables_cost) : null,
          inv_operational_mode_id: this.fields.inv_operational_mode_id ? Number(this.fields.inv_operational_mode_id) : null,
          inv_operational_condition_id: this.fields.inv_operational_condition_id ? Number(this.fields.inv_operational_condition_id) : null,
          identified_defect: this.fields.identified_defect || null
        }

        console.log("Submitting product with payload:", payload)
        console.log("Available product types:", this.productTypes)
        console.log("Available product categories:", this.productCategories)

        const result = this.editForm
          ? await this.updateProduct({ ...payload, id: this.itemId })
          : await this.addProduct(payload)

        console.log("Submit result:", result)

        if (result?.success === false && result?.errors) {
          this.errors = result.errors
          console.error("Validation errors from store:", this.errors)
          this.$toast.showMessage({
            message: this.$t("message.validation_errors"),
            status: "error"
          })
          return
        }

        if (result?.success === false) {
          this.$toast.showMessage({
            message: result.message || this.$t("message.error_saving"),
            status: "error"
          })
          return
        }

        this.closeDrawer()
        this.$toast.showMessage({
          message: this.$t("message.saved_successfully"),
          status: "success"
        })
      } catch (error) {
        console.error("Error saving product:", error)
        const apiErrors = error?.response?.data?.message
        if (apiErrors && typeof apiErrors === "object") {
          this.errors = apiErrors
          console.error("Validation errors from API:", this.errors)
          this.$toast.showMessage({
            message: this.$t("message.validation_errors"),
            status: "error"
          })
        } else {
          this.$toast.showMessage({
            message: error?.response?.data?.message || this.$t("message.error_saving"),
            status: "error"
          })
        }
      } finally {
        this.isSubmitting = false
      }
    },
    async loadProduct() {
      this.isLoading = true
      try {
        let product = this.products?.find((p) => p.id === this.itemId)
        if (!product) {
          product = await this.fetchProductById(this.itemId)
        } else {
          await this.fetchProductById(this.itemId)
        }

        const source = product || this.currentProduct
        if (source) {
          this.fields = {
            code: source.code || "",
            name: source.name || "",
            note: source.note || "",
            inv_products_type_id: source.inv_products_type_id || null,
            inv_products_category_id: source.inv_products_category_id || null,
            inv_unit_price: Number(source.inv_unit_price) || 0,
            inv_reorder_level: Number(source.inv_reorder_level) || 0,
            inv_qty_total: Number(source.inv_qty_total) || 0,
            inv_manufacturer_id: source.inv_manufacturer_id || null,
            inv_uom_id: source.inv_uom_id || null,
            buildings_id: source.buildings_id || null,
            inv_serial_owner: source.inv_serial_owner || "",
            inv_serial_Manufacturer: source.inv_serial_Manufacturer || "",
            inv_product_items_id: source.inv_product_items_id || null,
            inv_class: source.inv_class || "",
            capacity_unit: source.capacity_unit || "",
            design_capacity: source.design_capacity ? Number(source.design_capacity) : null,
            year_of_installation: source.year_of_installation ? Number(source.year_of_installation) : null,
            power: source.power ? Number(source.power) : null,
            power_unit: source.power_unit || "",
            asset_original_value: source.asset_original_value ? Number(source.asset_original_value) : null,
            annual_maintenance_labor_cost: source.annual_maintenance_labor_cost ? Number(source.annual_maintenance_labor_cost) : null,
            spares_cost: source.spares_cost ? Number(source.spares_cost) : null,
            annual_maintenance_cost: source.annual_maintenance_cost ? Number(source.annual_maintenance_cost) : null,
            consumables_cost: source.consumables_cost ? Number(source.consumables_cost) : null,
            inv_operational_mode_id: source.inv_operational_mode_id || null,
            inv_operational_condition_id: source.inv_operational_condition_id || null,
            identified_defect: source.identified_defect || ""
          }
        }
      } catch (error) {
        console.error("Error loading product:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    await Promise.all([
      this.fetchProductTypes(),
      this.fetchProductCategories(),
      this.fetchManufacturers(),
      this.fetchUoms(),
      this.fetchBuildings(),
      this.fetchProductModels(),
      this.fetchOperationalModes(),
      this.fetchOperationalConditions()
    ])
    
    if (this.editForm && this.itemId) {
      await this.loadProduct()
    }
  }
}
</script>

<style scoped>
.inv-product-form {
  width: 100%;
}
</style>
