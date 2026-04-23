<template>
  <div>
    <form-wrapper v-if="!fetchError && !loading" :title="title" @submit="submitRiskCause" :loading="isSubmitting">
      <custom-input
        :label="$t('form.name')"
        v-model="fields.code"
        :required="true"
        :errors="errors.code"
        @clear-errors="clearError('code')"
      />
      <quill-editor v-model="fields.note" class="mb-4" />
    </form-wrapper>
    <message-display
      v-if="fetchError"
      :messageTitle="fetchError.title"
      :messageText="fetchError.text"
      :code="fetchError.code"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex"
import { generateErrorMessage } from "@/helpers/error-helpers"
import MessageDisplay from "../MessageDisplay.vue"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "RiskCauseForm",
  components: { MessageDisplay, QuillEditor },
  props: {
    editForm: {
      type: Boolean,
      default: false
    },
    itemId: { type: Number }
  },
  layout: "dashboard-layout",
  data() {
    return {
      fields: {
        code: "",
        note: "",
        risk_id: this.$route.params.id
      },
      errors: {},
      fetchError: null,
      loading: false,
      isSubmitting: false
    }
  },
  computed: {
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.risk_cause")}`
    }
  },
  methods: {
    ...mapActions("riskCauses", ["createRiskCause", "updateRiskCause"]),
    ...mapActions("drawer", ["closeDrawer"]),
    async submitRiskCause() {
      this.isSubmitting = true
      this.errors = {}
      try {
        if (this.editForm) {
          await this.updateRiskCause({ id: this.itemId, payload: this.fields })
        } else {
          await this.createRiskCause(this.fields)
        }
        this.closeDrawer()
      } catch (error) {
        if (error?.response?.data) {
          this.errors = error.response.data.errors || {}
        } else {
          console.error(`Error ${this.editForm ? "editing" : "creating"} risk cause:`, error)
        }
      } finally {
        this.isSubmitting = false
      }
    },
    async fetchRiskCause() {
      this.loading = true
      try {
        const cause = await this.$store.getters["riskCauses/getRiskCauseById"](this.itemId)
        if (cause) {
          this.fields = {
            code: cause.code,
            note: cause.note,
            risk_id: cause.risk_id
          }
        } else {
          throw new Error("Risk cause not found")
        }
      } catch (error) {
        this.fetchError = generateErrorMessage(error, this.$i18n)
      } finally {
        this.loading = false
      }
    },
    clearError(field) {
      this.errors[field] = []
    }
  },
  mounted() {
    if (this.editForm) {
      this.fetchRiskCause()
    }
  }
}
</script>
