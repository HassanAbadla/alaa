<template>
  <div class="inv-transaction-type-form">
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
      <v-radio-group v-model="fields.inv_plusminus" :label="$t('form.transaction_direction')" row>
        <v-radio :label="$t('form.stock_in')" :value="1" />
        <v-radio :label="$t('form.stock_out')" :value="-1" />
      </v-radio-group>
      <quill-editor v-model="fields.note" :field-info-text="$t('table.note')" />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "InvTransactionTypesForm",
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
        inv_plusminus: 1,
        note: ""
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      transactionTypes: "invTransactionTypes/getTransactionTypes",
      currentTransactionType: "invTransactionTypes/getCurrentTransactionType"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_transaction_type")}`
    }
  },
  methods: {
    ...mapActions({
      addTransactionType: "invTransactionTypes/addTransactionType",
      updateTransactionType: "invTransactionTypes/updateTransactionType",
      fetchTransactionTypeById: "invTransactionTypes/fetchTransactionTypeById"
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
          inv_plusminus: Number(this.fields.inv_plusminus),
          note: this.fields.note
        }

        const result = this.editForm
          ? await this.updateTransactionType({ ...payload, id: this.itemId })
          : await this.addTransactionType(payload)

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
        console.error("Error saving transaction type:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadTransactionType() {
      this.isLoading = true
      try {
        let transactionType = this.transactionTypes?.find((t) => t.id === this.itemId)
        if (!transactionType) {
          transactionType = await this.fetchTransactionTypeById(this.itemId)
        } else {
          await this.fetchTransactionTypeById(this.itemId)
        }

        const source = transactionType || this.currentTransactionType
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            inv_plusminus: Number(source.inv_plusminus) || 1,
            note: source.note || ""
          }
        }
      } catch (error) {
        console.error("Error loading transaction type:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    if (this.editForm && this.itemId) {
      await this.loadTransactionType()
    }
  }
}
</script>

<style scoped>
.inv-transaction-type-form {
  width: 100%;
}
</style>
