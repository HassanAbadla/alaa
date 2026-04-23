// assessmentAnswers.js
import { createCrudStore } from "~/utils/storeFactory"

const config = {
  endpoint: "grc-assessment-answers",
  entityName: "answer",
  entityNamePlural: "answers",
  apiPlugin: "$axios",
  primaryKey: "id",
  numericFields: ["answer_weight", "checkbox_answer"],
  transformRequest: (data) => data,
  transformResponse: (data) => data,

  customGetters: {},

  customActions: {
    // Bulk create answers for an assessment
    async bulkCreateAnswers({ commit, dispatch }, { grc_assessment_id, answers }) {
      try {
        commit("SET_ADDING_ANSWER", true)
        commit("SET_ERROR", null)

        // Transform the payload to use singular field names (without 's')
        const payload = {
          grc_assessment_id,
          answers: answers.map((answer) => {
            const transformedAnswer = {
              grc_assessment_question_id: answer.grc_assessment_question_id,
              answer_weight: answer.answer_weight
            }

            // Include either checkbox_answer or answer_note
            if (answer.checkbox_answer !== undefined) {
              transformedAnswer.checkbox_answer = answer.checkbox_answer
            }
            if (answer.answer_note !== undefined) {
              transformedAnswer.answer_note = answer.answer_note
            }

            return transformedAnswer
          })
        }

        const response = await this.$axios.post("grc-assessment-answers/bulk", payload)

        // After bulk create, fetch all answers for this assessment to update the store
        await dispatch("fetchAnswers", { grc_assessment_id })

        return {
          success: true,
          data: response.data.data,
          message: "Answers saved successfully"
        }
      } catch (error) {
        console.error("Error bulk creating answers:", error)

        let errorMessage = error.message || "An error occurred while saving answers"

        if (error.response && error.response.data) {
          if (error.response.data.status === "error" && error.response.data.message) {
            const apiErrorMessage = error.response.data.message

            if (typeof apiErrorMessage === "object") {
              commit("SET_ERROR", apiErrorMessage)
              return {
                success: false,
                data: null,
                message: "Validation errors occurred",
                errors: apiErrorMessage
              }
            } else {
              errorMessage = apiErrorMessage
            }
          }
        }

        commit("SET_ERROR", errorMessage)
        return {
          success: false,
          data: null,
          message: errorMessage
        }
      } finally {
        commit("SET_ADDING_ANSWER", false)
      }
    }
  }
}

export default createCrudStore(config)
