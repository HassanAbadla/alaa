<template>
  <div class="inv-product-warranty-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :title="title" :loading="isSubmitting" @submit="handleSubmit">
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
        v-model="fields.inv_supplier_warrenty_contract_id"
        :label="$t('form.warranty_contract')"
        :items="contractItems"
        item-text="label"
        item-value="id"
        :required="true"
        :errors="errors.inv_supplier_warrenty_contract_id"
        @clear-errors="clearError('inv_supplier_warrenty_contract_id')"
      />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "InvProductWarrantiesForm",
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
        inv_product_id: null,
        inv_supplier_warrenty_contract_id: null
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      warranties: "invProductWarranties/getProductWarranties",
      currentWarranty: "invProductWarranties/getCurrentProductWarranty",
      products: "invProducts/getProducts",
      contracts: "invSupplierWarrantyContracts/getSupplierWarrantyContracts"
    }),
    contractItems() {
      return (this.contracts || []).map((c) => ({
        id: c.id,
        label: `${c.contract_start_date || "N/A"} — ${c.contract_end_date || "N/A"} (${c.contract_value || "N/A"})`
      }))
    },
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_product_warranty")}`
    }
  },
  methods: {
    ...mapActions({
      addWarranty: "invProductWarranties/addProductWarranty",
      updateWarranty: "invProductWarranties/updateProductWarranty",
      fetchWarrantyById: "invProductWarranties/fetchProductWarrantyById",
      fetchProducts: "invProducts/fetchProducts",
      fetchContracts: "invSupplierWarrantyContracts/fetchSupplierWarrantyContracts"
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
          inv_product_id: Number(this.fields.inv_product_id),
          inv_supplier_warrenty_contract_id: Number(this.fields.inv_supplier_warrenty_contract_id)
        }

        const result = this.editForm
          ? await this.updateWarranty({ ...payload, id: this.itemId })
          : await this.addWarranty(payload)

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
        console.error("Error saving product warranty:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadWarranty() {
      this.isLoading = true
      try {
        let warranty = this.warranties?.find((w) => w.id === this.itemId)
        if (!warranty) {
          warranty = await this.fetchWarrantyById(this.itemId)
        } else {
          await this.fetchWarrantyById(this.itemId)
        }

        const source = warranty || this.currentWarranty
        if (source) {
          this.fields = {
            inv_product_id: source.inv_product_id || null,
            inv_supplier_warrenty_contract_id: source.inv_supplier_warrenty_contract_id || null
          }
        }
      } catch (error) {
        console.error("Error loading product warranty:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    await Promise.all([
      this.fetchProducts(),
      this.fetchContracts()
    ])
    if (this.editForm && this.itemId) {
      await this.loadWarranty()
    }
  }
}
</script>

<style scoped>
.inv-product-warranty-form {
  width: 100%;
}
</style>
