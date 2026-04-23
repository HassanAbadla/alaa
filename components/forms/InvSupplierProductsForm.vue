<template>
  <div class="inv-supplier-product-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :title="title" :loading="isSubmitting" @submit="handleSubmit">
      <custom-input
        v-model="fields.name"
        :label="$t('form.supplier_name')"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      />
      <custom-select
        v-model="fields.inv_product_id"
        :label="$t('form.product')"
        :items="products"
        item-text="name"
        item-value="id"
        :required="true"
        :errors="errors.inv_product_id"
        @clear-errors="clearError('inv_product_id')"
      />
      <custom-select
        v-model="fields.inv_supplier_id"
        :label="$t('form.supplier')"
        :items="suppliers"
        item-text="name"
        item-value="id"
        :required="true"
        :errors="errors.inv_supplier_id"
        @clear-errors="clearError('inv_supplier_id')"
      />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "InvSupplierProductsForm",
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
        name: "",
        inv_product_id: null,
        inv_supplier_id: null
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      supplierProducts: "invSupplierProducts/getSupplierProducts",
      currentSupplierProduct: "invSupplierProducts/getCurrentSupplierProduct",
      products: "invProducts/getProducts",
      suppliers: "invSuppliers/getSuppliers"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_supplier_product")}`
    }
  },
  methods: {
    ...mapActions({
      addSupplierProduct: "invSupplierProducts/addSupplierProduct",
      updateSupplierProduct: "invSupplierProducts/updateSupplierProduct",
      fetchSupplierProductById: "invSupplierProducts/fetchSupplierProductById",
      fetchProducts: "invProducts/fetchProducts",
      fetchSuppliers: "invSuppliers/fetchSuppliers"
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
          name: this.fields.name,
          inv_product_id: Number(this.fields.inv_product_id),
          inv_supplier_id: Number(this.fields.inv_supplier_id)
        }

        const result = this.editForm
          ? await this.updateSupplierProduct({ ...payload, id: this.itemId })
          : await this.addSupplierProduct(payload)

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
        console.error("Error saving supplier product:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadSupplierProduct() {
      this.isLoading = true
      try {
        let supplierProduct = this.supplierProducts?.find((s) => s.id === this.itemId)
        if (!supplierProduct) {
          supplierProduct = await this.fetchSupplierProductById(this.itemId)
        } else {
          await this.fetchSupplierProductById(this.itemId)
        }

        const source = supplierProduct || this.currentSupplierProduct
        if (source) {
          this.fields = {
            name: source.name || "",
            inv_product_id: source.inv_product_id || null,
            inv_supplier_id: source.inv_supplier_id || null
          }
        }
      } catch (error) {
        console.error("Error loading supplier product:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    await Promise.all([this.fetchProducts(), this.fetchSuppliers()])
    if (this.editForm && this.itemId) {
      await this.loadSupplierProduct()
    }
  }
}
</script>

<style scoped>
.inv-supplier-product-form {
  width: 100%;
}
</style>
