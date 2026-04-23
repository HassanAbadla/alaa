<template>
  <div>
    <form-wrapper v-if="!fetchError && !loading" :title="title" @submit="submitRiskConsequence" :loading="isSubmitting">
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
  name: "RiskConsequenceForm",
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
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("form.risk_consequence")}`
    }
  },
  methods: {
    ...mapActions("riskConsequences", ["createRiskConsequence", "updateRiskConsequence"]),
    ...mapActions("drawer", ["closeDrawer"]),
    async submitRiskConsequence() {
      this.isSubmitting = true
      this.errors = {}
      try {
        if (this.editForm) {
          await this.updateRiskConsequence({ id: this.itemId, payload: this.fields })
        } else {
          await this.createRiskConsequence(this.fields)
        }
        this.closeDrawer()
      } catch (error) {
        if (error?.response?.data) {
          this.errors = error.response.data.errors || {}
        } else {
          console.error(`Error ${this.editForm ? "editing" : "creating"} risk consequence:`, error)
        }
      } finally {
        this.isSubmitting = false
      }
    },
    async fetchRiskConsequence() {
      this.loading = true
      try {
        const consequence = await this.$store.getters["riskConsequences/getRiskConsequenceById"](this.itemId)
        if (consequence) {
          this.fields = {
            code: consequence.code,
            note: consequence.note,
            risk_id: consequence.risk_id
          }
        } else {
          throw new Error("Risk consequence not found")
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
      this.fetchRiskConsequence()
    }
  }
}
</script>
