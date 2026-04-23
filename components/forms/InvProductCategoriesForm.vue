<template>
  <div class="inv-product-category-form">
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
  name: "InvProductCategoriesForm",
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
      productCategories: "invProductCategories/getProductCategories",
      currentProductCategory: "invProductCategories/getCurrentProductCategory"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_product_category")}`
    }
  },
  methods: {
    ...mapActions({
      addProductCategory: "invProductCategories/addProductCategory",
      updateProductCategory: "invProductCategories/updateProductCategory",
      fetchProductCategoryById: "invProductCategories/fetchProductCategoryById"
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
          note: this.fields.note
        }

        const result = this.editForm
          ? await this.updateProductCategory({ ...payload, id: this.itemId })
          : await this.addProductCategory(payload)

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
        console.error("Error saving product category:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadProductCategory() {
      this.isLoading = true
      try {
        let productCategory = this.productCategories?.find((c) => c.id === this.itemId)
        if (!productCategory) {
          productCategory = await this.fetchProductCategoryById(this.itemId)
        } else {
          await this.fetchProductCategoryById(this.itemId)
        }

        const source = productCategory || this.currentProductCategory
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            note: source.note || ""
          }
        }
      } catch (error) {
        console.error("Error loading product category:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    if (this.editForm && this.itemId) {
      await this.loadProductCategory()
    }
  }
}
</script>

<style scoped>
.inv-product-category-form {
  width: 100%;
}
</style>
