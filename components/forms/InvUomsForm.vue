<template>
  <div class="inv-uom-form">
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
      <quill-editor v-model="fields.description" :field-info-text="$t('table.description')" />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "InvUomsForm",
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
        description: ""
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      uoms: "invUoms/getUoms",
      currentUom: "invUoms/getCurrentUom"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_uom")}`
    }
  },
  methods: {
    ...mapActions({
      addUom: "invUoms/addUom",
      updateUom: "invUoms/updateUom",
      fetchUomById: "invUoms/fetchUomById"
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
          description: this.fields.description
        }

        const result = this.editForm
          ? await this.updateUom({ ...payload, id: this.itemId })
          : await this.addUom(payload)

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
        console.error("Error saving UOM:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadUom() {
      this.isLoading = true
      try {
        let uom = this.uoms?.find((u) => u.id === this.itemId)
        if (!uom) {
          uom = await this.fetchUomById(this.itemId)
        } else {
          await this.fetchUomById(this.itemId)
        }

        const source = uom || this.currentUom
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            description: source.description || ""
          }
        }
      } catch (error) {
        console.error("Error loading UOM:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    if (this.editForm && this.itemId) {
      await this.loadUom()
    }
  }
}
</script>

<style scoped>
.inv-uom-form {
  width: 100%;
}
</style>
