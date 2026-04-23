<template>
  <div class="mnt-material-used-form">
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
      <custom-input
        v-model="fields.quantity"
        :label="$t('form.quantity') || 'Quantity'"
        type="number"
        :errors="errors.quantity"
        @clear-errors="clearError('quantity')"
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
      <v-autocomplete
        v-model="fields.inv_transactions_id"
        :items="invTransactions"
        item-text="name"
        item-value="id"
        :label="$t('form.inv_transactions_id') || 'Inventory Transaction'"
        clearable
        outlined
        dense
        class="mb-2"
      />
      <v-autocomplete
        v-model="fields.mnt_maintenance_request_id"
        :items="maintenanceRequests"
        item-text="name"
        item-value="id"
        :label="$t('form.mnt_maintenance_request_id') || 'Maintenance Request'"
        clearable
        outlined
        dense
        class="mb-2"
      />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "MntMaterialUsedsForm",
  props: {
    editForm: { type: Boolean, default: false },
    itemId: { type: [Number, String], default: null }
  },
  data() {
    return {
      fields: {
        code: "",
        name: { en: "", ar: "" },
        quantity: null,
        inv_products_id: null,
        inv_transactions_id: null,
        mnt_maintenance_request_id: null,
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      materialUseds: "mntMaterialUseds/getMaterialUseds",
      currentMaterialUsed: "mntMaterialUseds/getCurrentMaterialUsed",
      invProducts: "invProducts/getProducts",
      invTransactions: "invTransactions/getTransactions",
      maintenanceRequests: "mntMaintenanceRequests/getMaintenanceRequests"
    }),
    title() {
      return `${this.editForm ? 'Edit' : 'Create'} Material Used`
    }
  },
  methods: {
    ...mapActions({
      addMaterialUsed: "mntMaterialUseds/addMaterialUsed",
      updateMaterialUsed: "mntMaterialUseds/updateMaterialUsed",
      fetchMaterialUsedById: "mntMaterialUseds/fetchMaterialUsedById",
      fetchInvProducts: "invProducts/fetchProducts",
      fetchInvTransactions: "invTransactions/fetchTransactions",
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
          quantity: this.fields.quantity,
          inv_products_id: this.fields.inv_products_id,
          inv_transactions_id: this.fields.inv_transactions_id,
          mnt_maintenance_request_id: this.fields.mnt_maintenance_request_id,
        }

        const result = this.editForm
          ? await this.updateMaterialUsed({ ...payload, id: this.itemId })
          : await this.addMaterialUsed(payload)

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
        console.error("Error saving Material Used:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadMaterialUsed() {
      this.isLoading = true
      try {
        let materialUsed = this.materialUseds?.find((c) => c.id === this.itemId)
        if (!materialUsed) {
          materialUsed = await this.fetchMaterialUsedById(this.itemId)
        } else {
          await this.fetchMaterialUsedById(this.itemId)
        }

        const source = materialUsed || this.currentMaterialUsed
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            quantity: source.quantity || null,
            inv_products_id: source.inv_products_id || null,
            inv_transactions_id: source.inv_transactions_id || null,
            mnt_maintenance_request_id: source.mnt_maintenance_request_id || null,
          }
        }
      } catch (error) {
        console.error("Error loading Material Used:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    this.fetchInvProducts()
    this.fetchInvTransactions()
    if (this.editForm && this.itemId) {
      await this.loadMaterialUsed()
    }
  }
}
</script>

<style scoped>
.mnt-material-used-form { width: 100%; }
</style>
