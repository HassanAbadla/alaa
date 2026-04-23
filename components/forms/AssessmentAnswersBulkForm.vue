<template>
  <v-can show-message :permission="'access_assessments'">
    <v-container fluid>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-btn icon @click="goBack" class="mr-2">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <span>{{ $t("page.assessment_answers") }}</span>
          <v-spacer></v-spacer>
          <v-chip v-if="assessmentDetails" class="ml-2" color="primary" outlined>
            {{ assessmentDetails.code }}
          </v-chip>
        </v-card-title>

        <v-divider></v-divider>

        <!-- Assessment Details -->
        <v-card-text v-if="assessmentDetails" class="pb-0">
          <v-row>
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 grey--text">{{ $t("form.name") }}</div>
              <div class="text-body-1 mb-2">{{ assessmentDetails.name }}</div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="text-subtitle-2 grey--text">{{ $t("table.assessment_date") }}</div>
              <div class="text-body-1 mb-2">{{ assessmentDetails.assessment_date }}</div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="text-subtitle-2 grey--text">
                {{ assessmentDetails.asset ? $t("form.asset") : $t("form.project") }}
              </div>
              <div class="text-body-1 mb-2">
                {{ assessmentDetails.asset?.name || assessmentDetails.project?.name || "-" }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider class="mt-2"></v-divider>

        <!-- Loading State -->
        <div v-if="isLoading" class="d-flex justify-center pa-12">
          <v-progress-circular indeterminate color="primary" size="64" />
        </div>

        <!-- Questions List -->
        <v-card-text v-else-if="questions.length > 0 && isAnswerDataInitialized" class="pt-4">
          <v-form ref="form">
            <div
              v-for="(question, index) in questions"
              :key="question.id"
              class="question-item mb-6 pa-4"
              :class="{ 'elevation-2': true }"
            >
              <div class="d-flex align-start mb-3">
                <v-chip small class="mr-3">{{ index + 1 }}</v-chip>
                <div class="flex-grow-1">
                  <div class="text-h6 mb-2">
                    {{ question.name }}
                    <v-chip x-small class="ml-2" v-if="question.code">
                      {{ question.code }}
                    </v-chip>
                  </div>
                  <div v-if="question.note" class="text-body-2 grey--text mb-3" v-html="question.note"></div>

                  <!-- Weight Input -->
                  <custom-input
                    v-model.number="answerData[question.id].answer_weight"
                    :label="$t('table.answer_weight')"
                    type="number"
                    :required="true"
                    class="mt-2"
                    style="max-width: 200px"
                  />

                  <!-- Checkbox Answer (when is_checkbox_answer is true) -->
                  <div v-if="question.is_checkbox_answer" class="mt-3">
                    <v-checkbox
                      v-model="answerData[question.id].checkbox_answer"
                      :label="$t('form.checkbox_answer')"
                      :true-value="1"
                      :false-value="0"
                      color="primary"
                    ></v-checkbox>
                  </div>

                  <!-- Note Answer (when is_checkbox_answer is false) -->
                  <div v-else class="mt-3">
                    <quill-editor
                      v-model="answerData[question.id].answer_note"
                      :field-info-text="$t('table.answer_note')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </v-form>
        </v-card-text>

        <!-- No Questions State -->
        <v-card-text v-else class="text-center pa-12">
          <v-icon size="64" color="grey lighten-1">mdi-help-circle-outline</v-icon>
          <div class="text-h6 grey--text mt-4">{{ $t("message.no_questions_available") }}</div>
        </v-card-text>

        <!-- Action Buttons -->
        <v-divider v-if="questions.length > 0 && isAnswerDataInitialized"></v-divider>
        <v-card-actions v-if="questions.length > 0 && isAnswerDataInitialized" class="pa-4">
          <v-spacer></v-spacer>
          <v-btn text @click="goBack">
            {{ $t("action.cancel") }}
          </v-btn>
          <v-btn color="primary" :loading="isSaving" :disabled="isSaving" @click="saveAllAnswers">
            <v-icon left>mdi-content-save</v-icon>
            {{ $t("action.save_all") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-can>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import QuillEditor from "@/components/QuillEditor.vue"

export default {
  name: "AssessmentAnswersBulkForm",

  components: {
    QuillEditor
  },
  data() {
    return {
      assessmentId: null,
      assessmentDetails: null,
      answerData: {}, // Will store answers keyed by question ID
      isLoading: false,
      isSaving: false,
      isAnswerDataInitialized: false // Add flag to track initialization
    }
  },
  computed: {
    ...mapGetters({
      questions: "assessmentQuestions/getQuestions",
      questionsLoading: "assessmentQuestions/isLoading",
      answers: "assessmentAnswers/getAnswers",
      answersLoading: "assessmentAnswers/isLoading"
    })
  },
  methods: {
    ...mapActions({
      fetchQuestions: "assessmentQuestions/fetchQuestions",
      fetchAnswers: "assessmentAnswers/fetchAnswers",
      bulkCreateAnswers: "assessmentAnswers/bulkCreateAnswers",
      fetchAssessmentById: "assessments/fetchAssessmentById"
    }),

    goBack() {
      this.$router.push("/assessments")
    },

    initializeAnswerData() {
      // Reset flag
      this.isAnswerDataInitialized = false

      // Create answer data structure for each question
      this.questions.forEach((question) => {
        // Check if we already have an answer for this question
        const existingAnswer = this.answers.find((answer) => answer.grc_assessment_question_id === question.id)

        if (existingAnswer) {
          // Use existing answer data
          this.$set(this.answerData, question.id, {
            grc_assessment_question_id: question.id,
            checkbox_answer: existingAnswer.checkbox_answer || 0,
            answer_note: existingAnswer.answer_note || "",
            answer_weight: existingAnswer.answer_weight || 0
          })
        } else {
          // Initialize with default values
          this.$set(this.answerData, question.id, {
            grc_assessment_question_id: question.id,
            checkbox_answer: 0,
            answer_note: "",
            answer_weight: 0
          })
        }
      })

      // Set flag to true after initialization is complete
      this.isAnswerDataInitialized = true
    },

    async loadData() {
      this.isLoading = true
      try {
        // Load assessment details
        this.assessmentDetails = await this.fetchAssessmentById(this.assessmentId)

        // Load all questions
        await this.fetchQuestions({ active: 1 })

        // Load existing answers for this assessment
        await this.fetchAnswers({ grc_assessment_id: this.assessmentId })

        // Initialize answer data
        this.initializeAnswerData()
      } catch (error) {
        console.error("Error loading assessment data:", error)
        this.$toast.showMessage({
          message: this.$t("message.error_loading_data"),
          status: "error"
        })
      } finally {
        this.isLoading = false
      }
    },

    async saveAllAnswers() {
      // Validate form
      if (!this.$refs.form.validate()) {
        this.$toast.showMessage({
          message: this.$t("message.please_fill_required_fields"),
          status: "warning"
        })
        return
      }

      this.isSaving = true
      try {
        // Convert answerData object to array
        const answers = Object.values(this.answerData).map((answer) => {
          // Only include the relevant field based on question type
          const question = this.questions.find((q) => q.id === answer.grc_assessment_question_id)

          if (question && question.is_checkbox_answer) {
            // For checkbox questions, send checkbox_answer
            return {
              grc_assessment_question_id: answer.grc_assessment_question_id,
              checkbox_answer: Number(answer.checkbox_answer),
              answer_weight: Number(answer.answer_weight)
            }
          } else {
            // For note questions, send answer_note
            return {
              grc_assessment_question_id: answer.grc_assessment_question_id,
              answer_note: answer.answer_note,
              answer_weight: Number(answer.answer_weight)
            }
          }
        })

        const result = await this.bulkCreateAnswers({
          grc_assessment_id: this.assessmentId,
          answers
        })

        if (result.success) {
          this.$toast.showMessage({
            message: this.$t("message.answers_saved_successfully"),
            status: "success"
          })
          // Optionally reload data to get updated answers
          await this.loadData()
        } else {
          this.$toast.showMessage({
            message: result.message || this.$t("message.error_saving_answers"),
            status: "error"
          })
        }
      } catch (error) {
        console.error("Error saving answers:", error)
        this.$toast.showMessage({
          message: this.$t("message.error_saving_answers"),
          status: "error"
        })
      } finally {
        this.isSaving = false
      }
    }
  },
  mounted() {
    this.assessmentId = Number(this.$route.params.id)
    if (!this.assessmentId) {
      this.$toast.showMessage({
        message: this.$t("message.invalid_assessment_id"),
        status: "error"
      })
      this.goBack()
      return
    }
    this.loadData()
  }
}
</script>

<style scoped>
.question-item {
  border-radius: 8px;
  background-color: #fafafa;
}
</style>
