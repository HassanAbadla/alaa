<template>
  <div class="inv-supplier-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :title="title" :loading="isSubmitting" @submit="handleSubmit">
      <custom-input
        v-model="fields.code"
        :label="$t('form.code')"
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
  name: "InvSuppliersForm",
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
      suppliers: "invSuppliers/getSuppliers",
      currentSupplier: "invSuppliers/getCurrentSupplier"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_supplier")}`
    }
  },
  methods: {
    ...mapActions({
      addSupplier: "invSuppliers/addSupplier",
      updateSupplier: "invSuppliers/updateSupplier",
      fetchSupplierById: "invSuppliers/fetchSupplierById"
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
          ? await this.updateSupplier({ ...payload, id: this.itemId })
          : await this.addSupplier(payload)

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
        console.error("Error saving supplier:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadSupplier() {
      this.isLoading = true
      try {
        let supplier = this.suppliers?.find((s) => s.id === this.itemId)
        if (!supplier) {
          supplier = await this.fetchSupplierById(this.itemId)
        } else {
          await this.fetchSupplierById(this.itemId)
        }

        const source = supplier || this.currentSupplier
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            note: source.note || ""
          }
        }
      } catch (error) {
        console.error("Error loading supplier:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    if (this.editForm && this.itemId) {
      await this.loadSupplier()
    }
  }
}
</script>

<style scoped>
.inv-supplier-form {
  width: 100%;
}
</style>
