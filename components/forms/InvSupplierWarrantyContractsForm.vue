<template>
  <div class="inv-supplier-warranty-contract-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :title="title" :loading="isSubmitting" @submit="handleSubmit">
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
      <custom-input
        v-model="fields.code"
        :label="$t('form.code')"
        :errors="errors.code"
        @clear-errors="clearError('code')"
      />
      <custom-input
        v-model="fields.contract_start_date"
        :label="$t('form.start_date')"
        type="date"
        :errors="errors.contract_start_date"
        @clear-errors="clearError('contract_start_date')"
      />
      <custom-input
        v-model="fields.contract_end_date"
        :label="$t('form.end_date')"
        type="date"
        :errors="errors.contract_end_date"
        @clear-errors="clearError('contract_end_date')"
      />
      <custom-input
        v-model="fields.contract_value"
        :label="$t('form.contract_value')"
        :errors="errors.contract_value"
        @clear-errors="clearError('contract_value')"
      />
      <quill-editor v-model="fields.note" :field-info-text="$t('table.note')" />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "InvSupplierWarrantyContractsForm",
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
        name: { en: "", ar: "" },
        code: "",
        note: "",
        contract_start_date: "",
        contract_end_date: "",
        contract_value: ""
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      contracts: "invSupplierWarrantyContracts/getSupplierWarrantyContracts",
      currentContract: "invSupplierWarrantyContracts/getCurrentSupplierWarrantyContract"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_supplier_warranty_contract")}`
    }
  },
  methods: {
    ...mapActions({
      addContract: "invSupplierWarrantyContracts/addSupplierWarrantyContract",
      updateContract: "invSupplierWarrantyContracts/updateSupplierWarrantyContract",
      fetchContractById: "invSupplierWarrantyContracts/fetchSupplierWarrantyContractById"
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
          code: this.fields.code,
          note: this.fields.note,
          contract_start_date: this.fields.contract_start_date || null,
          contract_end_date: this.fields.contract_end_date || null,
          contract_value: this.fields.contract_value || null
        }

        const result = this.editForm
          ? await this.updateContract({ ...payload, id: this.itemId })
          : await this.addContract(payload)

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
        console.error("Error saving warranty contract:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadContract() {
      this.isLoading = true
      try {
        let contract = this.contracts?.find((c) => c.id === this.itemId)
        if (!contract) {
          contract = await this.fetchContractById(this.itemId)
        } else {
          await this.fetchContractById(this.itemId)
        }

        const source = contract || this.currentContract
        if (source) {
          this.fields = {
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            code: source.code || "",
            note: source.note || "",
            contract_start_date: source.contract_start_date || "",
            contract_end_date: source.contract_end_date || "",
            contract_value: source.contract_value || ""
          }
        }
      } catch (error) {
        console.error("Error loading warranty contract:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    if (this.editForm && this.itemId) {
      await this.loadContract()
    }
  }
}
</script>

<style scoped>
.inv-supplier-warranty-contract-form {
  width: 100%;
}
</style>
