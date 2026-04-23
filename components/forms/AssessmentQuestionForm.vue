<template>
  <div class="assessment-question-form">
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
        v-model="fields.name"
        :label="$t('form.name')"
        :required="true"
        :errors="errors.name"
        @clear-errors="clearError('name')"
      />
      <quill-editor v-model="fields.note" :field-info-text="$t('table.note')" />
      <v-switch
        v-model="fields.is_checkbox_answer"
        inset
        :label="$t('table.is_checkbox_answer')"
        :errors="errors.is_checkbox_answer"
      />
      <custom-input
        v-model.number="fields.question_weight"
        :label="$t('table.question_weight')"
        type="number"
        :required="true"
        :errors="errors.question_weight"
        @clear-errors="clearError('question_weight')"
      />
      <v-switch v-model="fields.active" inset :label="$t('table.active')" />
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "AssessmentQuestionForm",
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
        name: "",
        note: "",
        is_checkbox_answer: true,
        active: true,
        question_weight: 0
      },
      errors: {},
      isSubmitting: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      questions: "assessmentQuestions/getQuestions",
      currentQuestion: "assessmentQuestions/getCurrentQuestion"
    }),
    title() {
      return `${this.editForm ? this.$t("form.edit") : this.$t("form.create")} ${this.$t("page.assessment_questions")}`
    }
  },
  methods: {
    ...mapActions({
      addQuestion: "assessmentQuestions/addQuestion",
      updateQuestion: "assessmentQuestions/updateQuestion",
      fetchQuestionById: "assessmentQuestions/fetchQuestionById"
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
          is_checkbox_answer: Boolean(this.fields.is_checkbox_answer),
          active: Boolean(this.fields.active),
          question_weight: Number(this.fields.question_weight)
        }

        const result = this.editForm
          ? await this.updateQuestion({ ...payload, id: this.itemId })
          : await this.addQuestion(payload)

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
        console.error("Error saving assessment question:", error)
      } finally {
        this.isSubmitting = false
      }
    },
    async loadQuestion() {
      this.isLoading = true
      try {
        let question = this.questions?.find((q) => q.id === this.itemId)
        if (!question) {
          question = await this.fetchQuestionById(this.itemId)
        } else {
          await this.fetchQuestionById(this.itemId)
        }

        const source = question || this.currentQuestion
        if (source) {
          this.fields = {
            code: source.code || "",
            name: source.name || "",
            note: source.note || "",
            is_checkbox_answer: Boolean(source.is_checkbox_answer),
            active: Boolean(source.active),
            question_weight: Number(source.question_weight) || 0
          }
        }
      } catch (error) {
        console.error("Error loading assessment question:", error)
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    if (this.editForm && this.itemId) {
      await this.loadQuestion()
    }
  }
}
</script>

<style scoped>
.assessment-question-form {
  width: 100%;
}
</style>
