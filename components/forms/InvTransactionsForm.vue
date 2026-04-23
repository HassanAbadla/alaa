<template>
  <div class="inv-transaction-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :title="title" :loading="isSubmitting" @submit="handleSubmit">
      <custom-input
        v-model="fields.name"
        :label="$t('form.name')"
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
      <custom-select
        v-model="fields.inv_transaction_category_id"
        :label="$t('form.transaction_category')"
        :items="filteredCategories"
        item-text="name"
        item-value="id"
        :required="true"
        :errors="errors.inv_transaction_category_id"
        @clear-errors="clearError('inv_transaction_category_id')"
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
        v-model="fields.inv_store_id"
        :label="$t('form.store')"
        :items="stores"
        item-text="name"
        item-value="id"
        :required="true"
        :errors="errors.inv_store_id"
        @clear-errors="clearError('inv_store_id')"
      />
      <custom-input
        v-model.number="fields.quantity"
        :label="$t('form.quantity')"
        type="number"
        :required="true"
        :errors="errors.quantity"
        @clear-errors="clearError('quantity')"
      />
      <custom-date-picker
        v-model="fields.inv_transaction_date"
        :label="$t('form.transaction_date')"
        :required="true"
        :errors="errors.inv_transaction_date"
        @clear-errors="clearError('inv_transaction_date')"
      />
      <quill-editor v-model="fields.note" :field-info-text="$t('table.note')" />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "InvTransactionsForm",
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
        name: "",
        note: "",

        inv_transaction_type_id: null,
        inv_transaction_category_id: null,
        inv_product_id: null,
        inv_store_id: null,
        quantity: 0,
        inv_transaction_date: new Date().toISOString().substr(0, 10)
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      transactions: "invTransactions/getTransactions",
      currentTransaction: "invTransactions/getCurrentTransaction",
      transactionTypes: "invTransactionTypes/getTransactionTypes",
      transactionCategories: "invTransactionCategories/getTransactionCategories",
      products: "invProducts/getProducts",
      stores: "invStores/getStores"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_transaction")}`
    },
    filteredCategories() {
      return this.transactionCategories
    }
  },
  methods: {
    ...mapActions({
      addTransaction: "invTransactions/addTransaction",
      updateTransaction: "invTransactions/updateTransaction",
      fetchTransactionById: "invTransactions/fetchTransactionById",
      fetchTransactionTypes: "invTransactionTypes/fetchTransactionTypes",
      fetchTransactionCategories: "invTransactionCategories/fetchTransactionCategories",
      fetchProducts: "invProducts/fetchProducts",
      fetchStores: "invStores/fetchStores"
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
          note: this.fields.note,

          inv_transaction_type_id: Number(this.fields.inv_transaction_type_id),
          inv_transaction_category_id: Number(this.fields.inv_transaction_category_id),
          inv_product_id: Number(this.fields.inv_product_id),
          inv_store_id: Number(this.fields.inv_store_id),
          quantity: Number(this.fields.quantity),
          inv_transaction_date: this.fields.inv_transaction_date
        }

        const result = this.editForm
          ? await this.updateTransaction({ ...payload, id: this.itemId })
          : await this.addTransaction(payload)

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
        console.error("Error saving transaction:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadTransaction() {
      this.isLoading = true
      try {
        let transaction = this.transactions?.find((t) => t.id === this.itemId)
        if (!transaction) {
          transaction = await this.fetchTransactionById(this.itemId)
        } else {
          await this.fetchTransactionById(this.itemId)
        }

        const source = transaction || this.currentTransaction
        if (source) {
          this.fields = {
            name: source.name || "",
            note: source.note || "",

            inv_transaction_type_id: source.inv_transaction_type_id || null,
            inv_transaction_category_id: source.inv_transaction_category_id || null,
            inv_product_id: source.inv_product_id || null,
            inv_store_id: source.inv_store_id || null,
            quantity: Number(source.quantity) || 0,
            inv_transaction_date: source.inv_transaction_date || new Date().toISOString().substr(0, 10)
          }
        }
      } catch (error) {
        console.error("Error loading transaction:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    await Promise.all([
      this.fetchTransactionTypes(),
      this.fetchTransactionCategories(),
      this.fetchProducts(),
      this.fetchStores()
    ])
    if (this.editForm && this.itemId) {
      await this.loadTransaction()
    }
  }
}
</script>

<style scoped>
.inv-transaction-form {
  width: 100%;
}
</style>
