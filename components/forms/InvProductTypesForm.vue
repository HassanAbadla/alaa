<template>
  <div class="inv-product-type-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :title="title" :loading="isSubmitting" @submit="handleSubmit">
      <custom-select
        v-model="fields.inv_product_category_id"
        :label="$t('form.product_category')"
        :items="productCategories"
        item-text="name"
        item-value="id"
        clearable
        :errors="errors.inv_product_category_id"
        @clear-errors="clearError('inv_product_category_id')"
      />
      <custom-input
        v-model="fields.code"
        :label="$t('form.code')"
        :required="true"
        :errors="errors.code"
        @clear-errors="clearError('code')"
      />
      <custom-input
        v-model="fields.name.en"
        :label="$t('form.en_name')"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      />
      <custom-input
        v-model="fields.name.ar"
        :label="$t('form.ar_name')"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      />
      <quill-editor v-model="fields.note" :field-info-text="$t('table.note')" />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "InvProductTypesForm",
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
        inv_product_category_id: null,
        code: "",
        name: { en: "", ar: "" },
        note: ""
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      productTypes: "invProductTypes/getProductTypes",
      currentProductType: "invProductTypes/getCurrentProductType",
      productCategories: "invProductCategories/getProductCategories"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_product_type")}`
    }
  },
  methods: {
    ...mapActions({
      addProductType: "invProductTypes/addProductType",
      updateProductType: "invProductTypes/updateProductType",
      fetchProductTypeById: "invProductTypes/fetchProductTypeById",
      fetchProductCategories: "invProductCategories/fetchProductCategories"
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
          inv_product_category_id: this.fields.inv_product_category_id || null,
          code: this.fields.code,
          name: this.fields.name,
          note: this.fields.note
        }

        const result = this.editForm
          ? await this.updateProductType({ ...payload, id: this.itemId })
          : await this.addProductType(payload)

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
        console.error("Error saving product type:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadProductType() {
      this.isLoading = true
      try {
        let productType = this.productTypes?.find((t) => t.id === this.itemId)
        if (!productType) {
          productType = await this.fetchProductTypeById(this.itemId)
        } else {
          await this.fetchProductTypeById(this.itemId)
        }

        const source = productType || this.currentProductType
        if (source) {
          this.fields = {
            inv_product_category_id: source.inv_product_category_id || null,
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            note: source.note || ""
          }
        }
      } catch (error) {
        console.error("Error loading product type:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    await this.fetchProductCategories()
    if (this.editForm && this.itemId) {
      await this.loadProductType()
    }
  }
}
</script>

<style scoped>
.inv-product-type-form {
  width: 100%;
}
</style>
