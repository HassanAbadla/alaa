<template>
  <div class="mnt-product-form">
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
        clearable
        outlined
        dense
        class="mb-2"
      />
      <v-autocomplete
        v-model="fields.inv_products_id"
        :items="invProducts"
        item-text="name"
        item-value="id"
        :label="$t('form.inv_products_id') || 'Inventory Product'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <custom-input
        v-model="fields.quantity"
        :label="$t('form.quantity') || 'Quantity'"
        type="number"
        :errors="errors.quantity"
        @clear-errors="clearError('quantity')"
      />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "MntProductsForm",
  props: {
    editForm: { type: Boolean, default: false },
    itemId: { type: [Number, String], default: null }
  },
  data() {
    return {
      fields: {
        code: "",
        name: { en: "", ar: "" },
        mnt_model_frequency_id: null,
        inv_products_id: null,
        quantity: null,
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      products: "mntProducts/getProducts",
      currentProduct: "mntProducts/getCurrentProduct",
      modelFrequencies: "mntModelFrequencies/getModelFrequencies",
      invProducts: "invProducts/getProducts"
    }),
    title() {
      return `${this.editForm ? 'Edit' : 'Create'} Product`
    }
  },
  methods: {
    ...mapActions({
      addProduct: "mntProducts/addProduct",
      updateProduct: "mntProducts/updateProduct",
      fetchProductById: "mntProducts/fetchProductById",
      fetchModelFrequencies: "mntModelFrequencies/fetchModelFrequencies",
      fetchInvProducts: "invProducts/fetchProducts"
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
          inv_products_id: this.fields.inv_products_id,
          quantity: this.fields.quantity,
        }

        const result = this.editForm
          ? await this.updateProduct({ ...payload, id: this.itemId })
          : await this.addProduct(payload)

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
        console.error("Error saving Product:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadProduct() {
      this.isLoading = true
      try {
        let product = this.products?.find((c) => c.id === this.itemId)
        if (!product) {
          product = await this.fetchProductById(this.itemId)
        } else {
          await this.fetchProductById(this.itemId)
        }

        const source = product || this.currentProduct
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            mnt_model_frequency_id: source.mnt_model_frequency_id || null,
            inv_products_id: source.inv_products_id || null,
            quantity: source.quantity || null,
          }
        }
      } catch (error) {
        console.error("Error loading Product:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    this.fetchModelFrequencies()
    this.fetchInvProducts()
    if (this.editForm && this.itemId) {
      await this.loadProduct()
    }
  }
}
</script>

<style scoped>
.mnt-product-form { width: 100%; }
</style>
