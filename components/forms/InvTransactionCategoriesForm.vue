<template>
  <div class="inv-transaction-category-form">
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
      <custom-select
        v-model="fields.inv_transaction_type_id"
        :label="$t('form.transaction_type')"
        :items="transactionTypes"
        item-text="name"
        item-value="id"
        :required="true"
        :errors="errors.inv_transaction_type_id"
        @clear-errors="clearError('inv_transaction_type_id')"
      />
      <quill-editor v-model="fields.note" :field-info-text="$t('table.note')" />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "InvTransactionCategoriesForm",
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
        note: "",
        inv_transaction_type_id: null
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      transactionCategories: "invTransactionCategories/getTransactionCategories",
      currentTransactionCategory: "invTransactionCategories/getCurrentTransactionCategory",
      transactionTypes: "invTransactionTypes/getTransactionTypes"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_transaction_category")}`
    }
  },
  methods: {
    ...mapActions({
      addTransactionCategory: "invTransactionCategories/addTransactionCategory",
      updateTransactionCategory: "invTransactionCategories/updateTransactionCategory",
      fetchTransactionCategoryById: "invTransactionCategories/fetchTransactionCategoryById",
      fetchTransactionTypes: "invTransactionTypes/fetchTransactionTypes"
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
          inv_transaction_type_id: Number(this.fields.inv_transaction_type_id)
        }

        const result = this.editForm
          ? await this.updateTransactionCategory({ ...payload, id: this.itemId })
          : await this.addTransactionCategory(payload)

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
        console.error("Error saving transaction category:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadTransactionCategory() {
      this.isLoading = true
      try {
        let transactionCategory = this.transactionCategories?.find((c) => c.id === this.itemId)
        if (!transactionCategory) {
          transactionCategory = await this.fetchTransactionCategoryById(this.itemId)
        } else {
          await this.fetchTransactionCategoryById(this.itemId)
        }

        const source = transactionCategory || this.currentTransactionCategory
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            note: source.note || "",
            inv_transaction_type_id: source.inv_transaction_type_id || null
          }
        }
      } catch (error) {
        console.error("Error loading transaction category:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    await this.fetchTransactionTypes()
    if (this.editForm && this.itemId) {
      await this.loadTransactionCategory()
    }
  }
}
</script>

<style scoped>
.inv-transaction-category-form {
  width: 100%;
}
</style>
