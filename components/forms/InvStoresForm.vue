<template>
  <div class="inv-store-form">
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
        v-model="fields.location_id"
        :label="$t('form.location')"
        :items="locations"
        item-text="name"
        item-value="id"
        :errors="errors.location_id"
        @clear-errors="clearError('location_id')"
      />
      <custom-select
        v-model="fields.inv_store_type_id"
        :label="$t('form.store_type')"
        :items="storeTypes"
        item-text="name"
        item-value="id"
        :errors="errors.inv_store_type_id"
        @clear-errors="clearError('inv_store_type_id')"
      />
      <quill-editor v-model="fields.note" :field-info-text="$t('table.note')" />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "InvStoresForm",
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
        location_id: null,
        inv_store_type_id: null
      },
      errors: {},
      isSubmitting: false,
      isLoading: false,
      locations: [] // TODO: Fetch from locations API if available
    }
  },
  computed: {
    ...mapGetters({
      stores: "invStores/getStores",
      currentStore: "invStores/getCurrentStore",
      storeTypes: "invStoreTypes/getStoreTypes"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_store")}`
    }
  },
  methods: {
    ...mapActions({
      addStore: "invStores/addStore",
      updateStore: "invStores/updateStore",
      fetchStoreById: "invStores/fetchStoreById",
      fetchStoreTypes: "invStoreTypes/fetchStoreTypes"
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
          location_id: this.fields.location_id ? Number(this.fields.location_id) : null,
          inv_store_type_id: this.fields.inv_store_type_id ? Number(this.fields.inv_store_type_id) : null
        }

        const result = this.editForm
          ? await this.updateStore({ ...payload, id: this.itemId })
          : await this.addStore(payload)

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
        console.error("Error saving store:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadStore() {
      this.isLoading = true
      try {
        let store = this.stores?.find((s) => s.id === this.itemId)
        if (!store) {
          store = await this.fetchStoreById(this.itemId)
        } else {
          await this.fetchStoreById(this.itemId)
        }

        const source = store || this.currentStore
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            note: source.note || "",
            location_id: source.location_id || null,
            inv_store_type_id: source.inv_store_type_id || null
          }
        }
      } catch (error) {
        console.error("Error loading store:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    await this.fetchStoreTypes()
    // TODO: Fetch locations if API is available
    if (this.editForm && this.itemId) {
      await this.loadStore()
    }
  }
}
</script>

<style scoped>
.inv-store-form {
  width: 100%;
}
</style>
