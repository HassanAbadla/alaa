<template>
  <div class="assessment-answer-form">
    <div v-if="isLoading" class="d-flex justify-center pa-6">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <form-wrapper v-else :loading="isSubmitting" @submit="handleSubmit">
      <!-- Question Note Display -->
      <div v-if="questionNote" class="question-note mb-4" v-html="questionNote"></div>

      <custom-input
        v-model.number="fields.answer_weight"
        :label="$t('table.answer_weight')"
        type="number"
        :required="true"
        :errors="errors.answer_weight"
        @clear-errors="clearError('answer_weight')"
      />

      <!-- Checkbox Answer (when is_checkbox_answer is true) -->
      <div v-if="question && question.is_checkbox_answer">
        <v-checkbox
          v-model="fields.checkbox_answer"
          :label="$t('table.checkbox_answer')"
          :true-value="1"
          :false-value="0"
          color="primary"
        ></v-checkbox>
      </div>

      <!-- Note Answer (when is_checkbox_answer is false) -->
      <div v-else>
        <quill-editor v-model="fields.answer_note" :field-info-text="$t('table.answer_note')" />
      </div>
    </form-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "AssessmentAnswerForm",
  components: {
    QuillEditor
  },
  props: {
    questionId: {
      type: [Number, String],
      required: true
    },
    questionNote: {
      type: String,
      default: ""
    },
    assessmentId: {
      type: [Number, String],
      required: true
    },
    editForm: {
      type: Boolean,
      default: false
    },
    answerId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      fields: {
        answer_weight: 0,
        checkbox_answer: 0,
        answer_note: ""
      },
      errors: {},
      isSubmitting: false,
      isLoading: false,
      question: null
    }
  },
  computed: {
    ...mapGetters({
      questions: "assessmentQuestions/getQuestions",
      answers: "assessmentAnswers/getAnswers"
    })
  },
  methods: {
    ...mapActions({
      addAnswer: "assessmentAnswers/addAnswer",
      updateAnswer: "assessmentAnswers/updateAnswer",
      fetchQuestionById: "assessmentQuestions/fetchQuestionById"
    }),

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
          grc_assessment_id: this.assessmentId,
          grc_assessment_question_id: this.questionId,
          answer_weight: Number(this.fields.answer_weight)
        }

        // Add the appropriate answer field based on question type
        if (this.question && this.question.is_checkbox_answer) {
          payload.checkbox_answer = Number(this.fields.checkbox_answer)
        } else {
          payload.answer_note = this.fields.answer_note
        }

        const result = this.editForm
          ? await this.updateAnswer({ ...payload, id: this.answerId })
          : await this.addAnswer(payload)

        if (result?.success === false && result?.errors) {
          this.errors = result.errors
          return
        }

        this.$toast.showMessage({
          message: this.$t("message.answer_saved_successfully"),
          status: "success"
        })
        this.$emit("close")
      } catch (error) {
        const apiErrors = error?.response?.data?.message
        if (apiErrors && typeof apiErrors === "object") {
          this.errors = apiErrors
        }
        console.error("Error saving answer:", error)
        this.$toast.showMessage({
          message: this.$t("message.error_saving_answer"),
          status: "error"
        })
      } finally {
        this.isSubmitting = false
      }
    },

    async loadData() {
      this.isLoading = true
      try {
        // Find question
        this.question = this.questions.find((q) => q.id === Number(this.questionId))
        if (!this.question) {
          this.question = await this.fetchQuestionById(this.questionId)
        }

        // If editing, load existing answer
        if (this.editForm && this.answerId) {
          const existingAnswer = this.answers.find((ans) => ans.id === Number(this.answerId))
          if (existingAnswer) {
            this.fields = {
              answer_weight: existingAnswer.answer_weight || 0,
              checkbox_answer: existingAnswer.checkbox_answer ? 1 : 0,
              answer_note: existingAnswer.answer_note || ""
            }
          }
        }
      } catch (error) {
        console.error("Error loading data:", error)
        this.$toast.showMessage({
          message: this.$t("message.error_loading_data"),
          status: "error"
        })
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>

<style scoped>
.assessment-answer-form {
  width: 100%;
}

.question-note {
  color: #616161;
  font-size: 14px;
  line-height: 1.5;
}
</style>
