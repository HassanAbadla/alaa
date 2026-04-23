<template>
  <div class="inv-stock-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :title="title" :loading="isSubmitting" @submit="handleSubmit">
      <custom-input
        v-model.number="fields.qty"
        :label="$t('form.quantity')"
        type="number"
        :required="true"
        :errors="errors.qty"
        @clear-errors="clearError('qty')"
      />
      <v-alert type="info" text dense class="mt-2">
        {{ $t("message.stock_update_only") }}
      </v-alert>
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "InvStockForm",
  props: {
    editForm: {
      type: Boolean,
      default: true // Stock is always edit-only
    },
    itemId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      fields: {
        qty: 0
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      stocks: "invStock/getStocks",
      currentStock: "invStock/getCurrentStock"
    }),
    title() {
      return `${this.$t("form.update")} ${this.$t("page.inv_stock")}`
    }
  },
  methods: {
    ...mapActions({
      updateStock: "invStock/updateStock",
      fetchStockById: "invStock/fetchStockById"
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
          qty: Number(this.fields.qty),
          id: this.itemId
        }

        const result = await this.updateStock(payload)

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
        console.error("Error updating stock:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadStock() {
      this.isLoading = true
      try {
        let stock = this.stocks?.find((s) => s.id === this.itemId)
        if (!stock) {
          stock = await this.fetchStockById(this.itemId)
        } else {
          await this.fetchStockById(this.itemId)
        }

        const source = stock || this.currentStock
        if (source) {
          this.fields = {
            qty: Number(source.qty) || 0
          }
        }
      } catch (error) {
        console.error("Error loading stock:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    if (this.itemId) {
      await this.loadStock()
    }
  }
}
</script>

<style scoped>
.inv-stock-form {
  width: 100%;
}
</style>
