<template>
  <div class="inv-operational-condition-form">
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
  name: "InvOperationalConditionsForm",
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
      operationalConditions: "invOperationalConditions/getOperationalConditions",
      currentOperationalCondition: "invOperationalConditions/getCurrentOperationalCondition"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.inv_operational_condition")}`
    }
  },
  methods: {
    ...mapActions({
      addOperationalCondition: "invOperationalConditions/addOperationalCondition",
      updateOperationalCondition: "invOperationalConditions/updateOperationalCondition",
      fetchOperationalConditionById: "invOperationalConditions/fetchOperationalConditionById"
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
          ? await this.updateOperationalCondition({ ...payload, id: this.itemId })
          : await this.addOperationalCondition(payload)

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
        console.error("Error saving Operational Condition:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadOperationalCondition() {
      this.isLoading = true
      try {
        let condition = this.operationalConditions?.find((c) => c.id === this.itemId)
        if (!condition) {
          condition = await this.fetchOperationalConditionById(this.itemId)
        } else {
          await this.fetchOperationalConditionById(this.itemId)
        }

        const source = condition || this.currentOperationalCondition
        if (source) {
          this.fields = {
            code: source.code || "",
            name: { en: source.name?.en || "", ar: source.name?.ar || "" },
            note: source.note || ""
          }
        }
      } catch (error) {
        console.error("Error loading Operational Condition:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    if (this.editForm && this.itemId) {
      await this.loadOperationalCondition()
    }
  }
}
</script>

<style scoped>
.inv-operational-condition-form {
  width: 100%;
}
</style>
